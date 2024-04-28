import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import { getUserIdFromEmail } from "@/app/api/db/Users";
import { fetchArtPromptsForUser, fetchArtContentForPrompt } from "@/app/api/db/Art";
import { generateSignedUrlFile } from "@/app/api/utils/gcp"

export async function GET(request: NextRequest, response: NextResponse) {
    try {
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

                // Fetch user literature prompts
                const fetchedArtPrompts = await fetchArtPromptsForUser(userId);

                if ("response" in fetchedArtPrompts) {

                    // Fetch user content for each art prompt 
                    const artPromptsAndContent = await Promise.all(fetchedArtPrompts.response.map(async (prompt: any, index: number) => {
                        const fetchedArtContentForPrompt = await fetchArtContentForPrompt(prompt.id);

                        // Get authenticated url for each generated image
                        let finalContent = null;
                        if ("response" in fetchedArtContentForPrompt) {
                            finalContent = await Promise.all(fetchedArtContentForPrompt.response.map(async (content: any, index: number) => {
                                let authenticatedImageUrl: any = content.image_path;
                                const generatedSignedUrl = await generateSignedUrlFile(process.env.GCP_CONTENT_RESULTS_BUCKET!, content.image_path)
                                authenticatedImageUrl = "url" in generatedSignedUrl ? generatedSignedUrl.url : "";
                                return {
                                    ...content,
                                    "image_path": authenticatedImageUrl
                                }
                            }));
                        }
        
                        return {
                            "prompt": prompt,
                            "content": prompt.success === 1 ? finalContent : null
                        }
                    }));
                    return NextResponse.json({
                        "response": artPromptsAndContent
                    }, {
                        status: 200
                    });
                } else {
                    return NextResponse.json({
                        "response": fetchedArtPrompts.error
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