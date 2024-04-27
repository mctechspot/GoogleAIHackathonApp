import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import fs from 'fs'
import { uuidv7 } from "uuidv7";
import { uploadFile } from "@/app/api/utils/gcp";
import { getImageTmpPathFromBase64String } from "@/app/utils/Files";

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const payload = await request.json();

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
            console.log(userData);
            if("response" in  userData && userData.response.length > 0){
                userId = userData.response[0].id;
            }
        } else {
            userData = null;
        }

        const generateContentRes = await fetch(`${process.env.FASTAPI_ENDPOINT}/generate-image-from-text`, {
            "body": JSON.stringify(payload),
            "method": "POST",
            "headers": {
                "Content-type": "application/json"
            }
        });

        const generateContentJson = await generateContentRes.json();

        if (userData && "response" in generateContentJson) {

            // Initialise ID for content entry in database
            const contentEntryUUID: string = uuidv7();
         
            // Convert base64 images to pngs and write to /tmp
            const imagesWritten = await Promise.all(generateContentJson.response.map(async (base64String: string, index: number) => {
                try {
                    return getImageTmpPathFromBase64String(base64String);
                } catch (error: any) {
                    console.log(`Error writing file image_${index + 1}.png: ${error.message}`);
                    return {
                        imageName: null,
                        imagePath: null,
                    };
                }
            }));

            // Upload generated images stored in /tmp file to GCP cloud storage bucket
            const imageUploadResults = imagesWritten.forEach(async(image: any, index: number) => {
                if("imageUUID" in image && "imageName" in image && "imagePath" in image){

                    // Set unique destination file of image in GCP Cloud Storage bucket
                    const destinationFilePath:string = `images/${userData.email}/${contentEntryUUID}/${image.imageName}`;
                    
                    // upload file to GCP
                    const uploadFileResult = await uploadFile(process.env.GCP_CONTENT_RESULTS_BUCKET!, image.imagePath, destinationFilePath);
                    
                    // Remove file from /tmp
                    fs.unlinkSync(image.imagePath);

                    return uploadFileResult;
                }
            });            
        }

        const status: number = "warning" in generateContentJson ? 400 : "error" in generateContentJson ? 500 : 200;
        return NextResponse.json(generateContentJson, { status: status });

    } catch (error: any) {
        console.log(`Error generating image from text prompt: ${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}