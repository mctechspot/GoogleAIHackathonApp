import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import { uuidv7 } from "uuidv7";
import { getUserIdFromEmail } from "@/app/api/db/Users"
import { addLiteraturePrompt, addGeneratedLiteratureContent } from "@/app/api/db/Literature"
import { getNowUtc } from "@/app/utils/Dates"
import { getImageTmpPathFromFile } from "@/app/utils/Files"
import { uploadFile } from "@/app/api/utils/gcp";
import fs from "fs";

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const payload = await request.formData();

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

        // Call endpoint to generate text for prompt that uses both text prompt and image
        const request_timestamp: any = getNowUtc();
        const generatedContentRes = await fetch(`${process.env.FASTAPI_ENDPOINT}/generate-text-from-image`, {
            "body": payload,
            "method": "POST"
        });

        // If there is a present Google session, save literature prompt and generated content to database
        const generatedContentJson = await generatedContentRes.json();

        // If there is a present Google session, save literature prompt and generated content to database
        if (userData && userId !== "") {
            const promptId: string = uuidv7();
            const rawImage: File = payload.get("image") as unknown as File;
            const promptText: string = payload.get("prompt") as unknown as string;
            const contentType: string = payload.get("content_type") as unknown as string;
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

        const status: number = "warning" in generatedContentJson ? 400 : "error" in generatedContentJson ? 500 : 200;

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