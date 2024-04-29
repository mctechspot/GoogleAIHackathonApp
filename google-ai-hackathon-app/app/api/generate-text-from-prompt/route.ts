import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import { uuidv7 } from "uuidv7";
import { getUserIdFromEmail } from "@/app/api/db/Users"
import { addLiteraturePrompt, addGeneratedLiteratureContent, getLiteratureContentTypeById } from "@/app/api/db/Literature"
import { getNowUtc } from "@/app/utils/Dates"
import { generateTextFromTextPrompt } from "@/app/api/genAi/GenerativeAIFunctions"

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const request_timestamp: any = getNowUtc();
        const payload = await request.json();

        if (payload.prompt.trim() === "") {
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

        // Get art style from database
        const literatureContentTypeRes: any = await getLiteratureContentTypeById(payload.content_type)
        let contentType: string = "story";
        if ("response" in literatureContentTypeRes && literatureContentTypeRes.response.length > 0) {
            console.log(literatureContentTypeRes.response[0].content_type.toLowerCase());
            contentType = literatureContentTypeRes.response[0].content_type.toLowerCase();
        }

        // Generate content with only text prompt
        const generatedContentJson = await generateTextFromTextPrompt(contentType, payload.prompt);

        // If there is a present Google session, save literature prompt and generated content to database
        if (userData && userId !== "") {
            const promptId: string = uuidv7();
            const finalPayload = {
                ...payload,
                "image": null
            }

            // Save literature prompt to database
            const addLiteraturePromptRes = await addLiteraturePrompt(promptId, userId, request_timestamp, payload, generatedContentJson);

            // Use generated id for literature prompt to save generated literature content in database
            if ("prompt_id" in addLiteraturePromptRes) {
                const addGeneratedLiteratureContentRes = await addGeneratedLiteratureContent(userId, promptId, payload, generatedContentJson);
            }
        }

        const status: number = "warnings" in generatedContentJson ? 400 : "error" in generatedContentJson ? 500 : 200;

        return NextResponse.json(generatedContentJson, { status: status });

    } catch (error: any) {
        console.log(`Error generating text content from prompt :${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}