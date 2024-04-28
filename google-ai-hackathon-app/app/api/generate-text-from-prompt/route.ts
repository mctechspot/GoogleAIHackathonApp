import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import { uuidv7 } from "uuidv7";
import { getUserIdFromEmail } from "@/app/api/db/Users"
import { addLiteraturePrompt, addGeneratedLiteratureContent } from "@/app/api/db/Literature"
import { getNowUtc } from "@/app/utils/Dates"

export async function POST(request: NextRequest, response: NextResponse){
    try{
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

            // Get user Id for email decoded in next-auth sessiont token
            const userIdFromEmail = await getUserIdFromEmail(userData.email);
            
            if("response" in userIdFromEmail){
                userId = userIdFromEmail.response[0].id
            }
        } else {
            userData = null;
        }

        // Call endpoint to generate text for prompt that uses solely text
        const request_timestamp: any = getNowUtc();
        const generatedContentRes = await fetch(`${process.env.FASTAPI_ENDPOINT}/generate-text`, {
            "body": JSON.stringify(payload),
            "method": "POST",
            "headers": {
                "Content-type": "application/json"
            }
        });

        // Get json response for generated literature content
        const generatedContentJson = await generatedContentRes.json();

        // If there is a present Google session, save literature prompt and generated content to database
        if (userData && userId !== ""){
            const promptId: string = uuidv7();
            const finalPayload = {
                ...payload,
                "image": null
            }

            // Save literature prompt to database
            const addLiteraturePromptRes = await addLiteraturePrompt(promptId, userId, request_timestamp, payload, generatedContentJson);
            
            // Use generated id for literature prompt to save generated literature content in database
            if("prompt_id" in addLiteraturePromptRes){
                const addGeneratedLiteratureContentRes = await addGeneratedLiteratureContent(userId, promptId, payload, generatedContentJson);
            }
        }

        const status: number = "warning" in generatedContentJson ? 400 : "error" in generatedContentJson ? 500 : 200;
        
        return NextResponse.json(generatedContentJson, {status: status});

    }catch(error: any){
        console.log(`Error generating text content from prompt :${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}