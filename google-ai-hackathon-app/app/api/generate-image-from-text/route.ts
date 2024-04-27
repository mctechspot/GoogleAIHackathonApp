import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import fs from 'fs'
import { uuidv7 } from "uuidv7";
import { uploadFile } from "@/app/api/utils/gcp";

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const payload = await request.json();

        // Check cookies to see if next-auth session token exists
        const cookieStore = cookies()
        const nextAuthSessionCookie: any = cookieStore.get('next-auth.session-token');

        // Get user credentials from next-auth session token if it exsists
        let userData: any = null;
        if (nextAuthSessionCookie !== undefined && nextAuthSessionCookie && "value" in nextAuthSessionCookie) {
            userData = await decode({
                token: nextAuthSessionCookie.value,
                secret: process.env.NEXTAUTH_SECRET!,
            });
            console.log(userData);
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
                    // Convert base64 image string to a buffer
                    const imageData: any = Buffer.from(base64String, 'base64');

                    // Initialise id, file name and file path at /tmp for image
                    const imageUUID: string = uuidv7();
                    const tmpImageName:string = `image_${imageUUID}.png`;
                    const tmpImagePath: string = `/tmp/${tmpImageName}`;

                    // Save generated images to in /tmp
                    fs.writeFileSync(tmpImagePath, imageData);
                    console.log(`${tmpImagePath} successfully written.`);
                    return {
                        imageUUID: imageUUID,
                        imageName: tmpImageName,
                        imagePath: tmpImagePath,
                    };
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