import { NextRequest, NextResponse } from "next/server"
import { google } from 'googleapis';
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import fs from 'fs'
import { uuidv7 } from "uuidv7";
import { uploadFile } from "@/app/api/utils/gcp";
import { getNowUtc } from "@/app/utils/Dates"
import { getUserIdFromEmail } from "@/app/api/db/Users"
import { getImageTmpPathFromBase64String } from "@/app/utils/Files";
import { addArtPrompt, addGeneratedArtContent } from "@/app/api/db/Art"
import { getArtStyleById, getImageOrientationById } from "@/app/api/db/Art"
import { base64ToJSON } from "@/app/utils/DataParsing"

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const requestTimestamp: any = getNowUtc();
        const payload = await request.json();

        if (payload.prompt.trim() === "") {
            return NextResponse.json({
                "input_error": "Prompt cannot be empty",
            }, {
                status: 400
            });
        }

        // Check cookies to see if next-auth session token exists
        const cookieStore = cookies();
        const nextAuthSessionCookie: any = cookieStore.get('next-auth.session-token');

        // Get user credentials from next-auth session token if it exsists
        let userData: any = null;
        let userId: string = "";
        if (nextAuthSessionCookie !== undefined && nextAuthSessionCookie && "value" in nextAuthSessionCookie) {
            userData = await decode({
                token: nextAuthSessionCookie.value,
                secret: process.env.NEXTAUTH_SECRET!,
            });

            // Get user Id for email decoded in next-auth sessiont token
            const userIdFromEmail = await getUserIdFromEmail(userData.email);
            if ("response" in userIdFromEmail) {
                userId = userIdFromEmail.response[0].id
            }
        } else {
            userData = null;
        }

        // Get art style from database
        const artStyleRes: any = await getArtStyleById(payload.style)
        let artStyle: string = "1:1";
        if ("response" in artStyleRes && artStyleRes.response.length > 0) {
            artStyle = artStyleRes.response[0].style.toLowerCase();
        }

        // Get image ratio from database
        const imageOrientationsRes: any = await getImageOrientationById(payload.orientation)
        let ratio: string = "1:1";
        if ("response" in imageOrientationsRes && imageOrientationsRes.response.length > 0) {
            ratio = imageOrientationsRes.response[0].ratio.toLowerCase();
        }

        // Decode GCP Service Account key string to JSON format to get credentials
        const gcpServiceAccountJson = base64ToJSON(process.env.GCP_SA_KEY_STRING!);

        // Create JWT client to generate token using GCP Service account credentials
        const jwtClient = new google.auth.JWT({
            email: gcpServiceAccountJson.client_email,
            key: gcpServiceAccountJson.private_key,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        // Generate JWT access token to authorise image generation request
        const tokens = await jwtClient.authorize();
        const accessToken = tokens.access_token;

        // Create request body for image generation
        const requestBody = {
            "instances": [
                {
                    "prompt": `${artStyle} of ${payload.prompt}`
                }
            ],
            "parameters": {
                "sampleCount": 3,
                "aspectRatio": ratio,
                "addWatermark": false,
            }
        };

        // Construct image generation request url with GCP project data variables
        const requestUrl: string = `https://${process.env.GCP_LOCATION}-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_LOCATION}/publishers/google/models/imagegeneration@006:predict`;

        // Make the HTTP request with the generated token
        const imageGenerationRequest = await fetch(requestUrl, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        // Initialise generation response to error response
        // subject to change if image generation is successgful or if warning messages are found
        let generationResponse: any = { "error": "Something went wrong" };

        // Get json for image generation response
        const imageGenerationJson = await imageGenerationRequest.json();
        let base64Images: string[] = [];
        if ("predictions" in imageGenerationJson) {
            base64Images = imageGenerationJson.predictions.map((prediction: any, index: number) => {
                return prediction.bytesBase64Encoded
            });
            generationResponse = { "response": base64Images }
        }

        // Check for sensitive input warnings
        if ("error" in imageGenerationJson) {
            let warnings: string[] = [];

            // Check for sensitive input error and add them to warning key in generation response
            if (imageGenerationJson.error.message === "Image generation failed with the following error: The prompt could not be submitted. Your current safety settings for person/face generation prohibited one or more words in this prompt. If you think this was an error, send feedback.") {
                warnings = ["Content blocked for ethical reasons. Please ensure that your prompt does not elicit drugs, violence or sensual content."];
            }
            if (imageGenerationJson.error.message === "Image generation failed with the following error: The prompt could not be submitted. This prompt contains sensitive words that violate Google's Responsible AI practices. Try rephrasing the prompt. If you think this was an error, send feedback.") {
                warnings = ["Content blocked for ethical reasons. Please ensure that your prompt does not elicit drugs, violence or sensual content."];
            }

            if (warnings.length > 0) {
                generationResponse = { "warnings": warnings }
            }
        }

        if (userData && userId !== "") {

            // Initialise ID for content entry in database
            //const contentEntryUUID: string = uuidv7();
            const promptId: string = uuidv7();
            let finalGeneratedImagePaths: any = [];

            if ("response" in generationResponse) {
                // Convert base64 images to pngs and write to /tmp
                const imagesWrittenToTmp = await Promise.all(generationResponse.response.map(async (base64String: string, index: number) => {
                    return getImageTmpPathFromBase64String(base64String);
                }));

                // Upload generated images stored in /tmp file to GCP cloud storage bucket
                const imageUploadResults = imagesWrittenToTmp.forEach(async (image: any, index: number) => {
                    if ("imageUUID" in image && "imageName" in image && "imagePath" in image) {

                        // Set unique destination file of image in GCP Cloud Storage bucket
                        const destinationFilePath: string = `art/${userId}/${promptId}/images/${image.imageName}`;
                        finalGeneratedImagePaths.push(destinationFilePath);

                        // upload file to GCP
                        const uploadFileResult = await uploadFile(process.env.GCP_CONTENT_RESULTS_BUCKET!, image.imagePath, destinationFilePath);

                        // Remove file from /tmp
                        fs.unlinkSync(image.imagePath);

                        return uploadFileResult;
                    }
                });
            }

            const addArtPromptRes = await addArtPrompt(promptId, userId, requestTimestamp, payload, generationResponse);

            if ("prompt_id" in addArtPromptRes && finalGeneratedImagePaths.length > 0) {

                finalGeneratedImagePaths.forEach(async (imagePath: string, index: number) => {
                    let finalGeneratedContent = {
                        "image_no": index + 1,
                        "image_path": imagePath
                    }
                    const addGeneratedArtContentRes = await addGeneratedArtContent(userId, addArtPromptRes.prompt_id, finalGeneratedContent);

                });

            }
        }

        const status: number = "warnings" in generationResponse ? 400 : "error" in generationResponse ? 500 : 200;

        return NextResponse.json(generationResponse, { status: status });

    } catch (error: any) {
        console.log(`Error generating image from text prompt: ${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}