import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import { uuidv7 } from "uuidv7";
import { getUserIdFromEmail } from "@/app/api/db/Users"
import { addLiteraturePrompt, addGeneratedLiteratureContent } from "@/app/api/db/Literature"
import { getNowUtc } from "@/app/utils/Dates"
import { checkImageCompatibility, getImageTmpPathFromFile } from "@/app/utils/Files"
import { uploadFile } from "@/app/api/utils/gcp";
import { generateTextFromTextAndImagePrompt } from "@/app/api/genAi/GenerativeAIFunctions"
import fs from "fs";

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const request_timestamp: any = getNowUtc();
        const payload = await request.formData();

        const rawImage: File = payload.get("image") as unknown as File;
        const promptText: string = payload.get("prompt") as unknown as string;
        const contentType: string = payload.get("content_type") as unknown as string;

        // Return bad request response for empty prompt
        if (promptText.trim() === "") {
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

        let generatedContentJson: any = null;
        // Check for image warnings and return bad request error if image is incompatible
        const imageWarnings: string[] = checkImageCompatibility(rawImage);
        if (imageWarnings.length > 0) {
            generatedContentJson = { "warnings": [imageWarnings] };
        } else {
            // Generate content with text and image prompt
            generatedContentJson = await generateTextFromTextAndImagePrompt(contentType, promptText, rawImage);
        }

        // If there is a present Google session, save literature prompt and generated content to database
        if (userData && userId !== "") {
            const promptId: string = uuidv7();
            const image = await getImageTmpPathFromFile(rawImage);
            const finalImage: string = `literature/${userId}/${promptId}/image_prompt/${rawImage.name}`;

            // Upload prompt image to GCP
            if ("imageUUID" in image && "imageName" in image && "imagePath" in image) {

                // Set unique destination file of image in GCP Cloud Storage bucket
                const destinationFilePath: string = finalImage;

                // upload file to GCP
                const uploadFileResult = await uploadFile(process.env.GCP_CONTENT_RESULTS_BUCKET!, image.imagePath, destinationFilePath);

                // Remove file from /tmp
                fs.unlinkSync(image.imagePath);
            }

            const payloadAsJson: any = {
                "prompt": promptText,
                "content_type": contentType,
                "image": finalImage
            };

            // Save literature prompt to database
            const addLiteraturePromptRes = await addLiteraturePrompt(promptId, userId, request_timestamp, payloadAsJson, generatedContentJson);

            // Use generated id for literature prompt to save generated literature content in database
            if ("prompt_id" in addLiteraturePromptRes) {
                const addGeneratedLiteratureContentRes = await addGeneratedLiteratureContent(userId, addLiteraturePromptRes.prompt_id, payload, generatedContentJson);
            }
        }

        const status: number = "warnings" in generatedContentJson ? 400 : "error" in generatedContentJson ? 500 : 200;

        return NextResponse.json(generatedContentJson, { status: status });

    } catch (error: any) {
        console.log(`Error generating text content from prompt and image:${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}