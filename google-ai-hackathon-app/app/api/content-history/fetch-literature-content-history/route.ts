'use server'

import { NextRequest, NextResponse } from "next/server"
import { decode } from 'next-auth/jwt';
import { getUserIdFromEmail } from "@/app/api/db/Users";
import { fetchLiteraturePromptsForUser, fetchLiteratureContentForPrompt, getLiteratureContentTypeById } from "@/app/api/db/Literature";
import { generateSignedUrlFile } from "@/app/api/utils/gcp"
import { getCookieData } from "@/app/api/cookies/cookies"

export async function GET(request: NextRequest, response: NextResponse) {
    try {
        // Check cookies to see if next-auth session token exists
        const cookieStore:any = await getCookieData();
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

                // Fetch user literature prompts
                const fetchedLiteraturePrompts = await fetchLiteraturePromptsForUser(userId);

                if ("response" in fetchedLiteraturePrompts) {
                    // Fetch user content for each literature prompt 
                    const literaturePromptsAndContent = await Promise.all(fetchedLiteraturePrompts.response.map(async (prompt: any, index: number) => {
                        const fetchedLiteratureContentForPrompt = await fetchLiteratureContentForPrompt(prompt.id);
                        
                        // Get literature prompt content type lookup data
                        const literatureContentTypeRes: any = await getLiteratureContentTypeById(prompt.content_type);
                        let finalLiteratureContentType = prompt.content_type;
                        if("response" in literatureContentTypeRes){
                            finalLiteratureContentType = literatureContentTypeRes.response[0];
                        }

                        // Get authenticated url if image was used in prompt
                        let authenticatedImageUrl: any = null;
                        if(prompt.image_path){
                            const generatedSignedUrl = await generateSignedUrlFile(process.env.GCP_CONTENT_RESULTS_BUCKET!, prompt.image_path)
                            authenticatedImageUrl = "url" in generatedSignedUrl ? generatedSignedUrl.url : "";
                        }
                        
                        let finalContent: any = null;
                        if ("response" in fetchedLiteratureContentForPrompt) {
                            finalContent = fetchedLiteratureContentForPrompt.response[0];
                        }
                        return {
                            "prompt": {
                                ...prompt, 
                                "content_type": finalLiteratureContentType,
                                "image_path": authenticatedImageUrl
                            },
                            "content": prompt.success === 1 ? finalContent : null
                        }
                    }));
                    return NextResponse.json({
                        "response": literaturePromptsAndContent
                    }, {
                        status: 200
                    });
                } else {
                    return NextResponse.json({
                        "response": fetchedLiteraturePrompts.error
                    }, {
                        status: 400
                    });
                }
            }
        } else {
            userData = null;
            return NextResponse.json({
                "error": "Unauthenticated user."
            }, {
                status: 403
            });
        }
    } catch (error: any) {
        console.log(`Error fetching literature content history: ${error.message}.`);
        return NextResponse.json({
            "error": error.message
        }, {
            status: 500
        });
    }
}