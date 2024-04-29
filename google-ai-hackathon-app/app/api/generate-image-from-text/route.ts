import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import fs from 'fs'
import { uuidv7 } from "uuidv7";
import { uploadFile } from "@/app/api/utils/gcp";
import { getNowUtc } from "@/app/utils/Dates"
import { getUserIdFromEmail } from "@/app/api/db/Users"
import { getImageTmpPathFromBase64String } from "@/app/utils/Files";
import { addArtPrompt, addGeneratedArtContent } from "@/app/api/db/Art"

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const payload = await request.json();

        if(payload.prompt.trim() === ""){
            return NextResponse.json({
                "input_error": "Prompt cannot be empty",
            }, {
                status: 400
            });
        }

        // Check cookies to see if next-auth session token exists
        const cookieStore = cookies()
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

        // Call endpoint to generate image from text prompt
        const requestTimestamp: any = getNowUtc();
        const generatedContentRes = await fetch(`${process.env.FASTAPI_ENDPOINT}/generate-image-from-text`, {
            "body": JSON.stringify(payload),
            "method": "POST",
            "headers": {
                "Content-type": "application/json"
            }
        });

        // Get json response for generated literature content
        const generatedContentJson = await generatedContentRes.json();

        if (userData && userId !== "") {

            // Initialise ID for content entry in database
            //const contentEntryUUID: string = uuidv7();
            const promptId: string = uuidv7();
            let finalGeneratedImagePaths: any = [];

            if ("response" in generatedContentJson) {
                // Convert base64 images to pngs and write to /tmp
                const imagesWrittenToTmp = await Promise.all(generatedContentJson.response.map(async (base64String: string, index: number) => {
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

            const addArtPromptRes = await addArtPrompt(promptId, userId, requestTimestamp, payload, generatedContentJson);

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

        const status: number = "warning" in generatedContentJson ? 400 : "error" in generatedContentJson ? 500 : 200;

        return NextResponse.json(generatedContentJson, { status: status });

    } catch (error: any) {
        console.log(`Error generating image from text prompt: ${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}