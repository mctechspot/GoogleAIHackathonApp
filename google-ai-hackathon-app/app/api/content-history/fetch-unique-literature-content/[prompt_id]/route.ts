import { NextRequest, NextResponse } from "next/server"
import { decode } from 'next-auth/jwt';
import { getUserIdFromEmail } from "@/app/api/db/Users";
import { fetchLiteraturePromptById, fetchLiteratureContentForPrompt, getLiteratureContentTypeById } from "@/app/api/db/Literature";
import { generateSignedUrlFile } from "@/app/api/utils/gcp"
import { validUUIDv7 } from "@/app/utils/DataValidation"
import { getCookieData } from "@/app/api/cookies/cookies"

export async function GET(request: NextRequest, { params }: { params: { prompt_id: string } }) {
    try {

        const promptId = params.prompt_id;

        // Return bad request if prompt id passed in get url is not of a valid UUID type
        if (!validUUIDv7(promptId)) {
            return NextResponse.json({
                "response": {
                    "prompt": null,
                    "content": null
                }
            }, {
                status: 400
            });
        }

        // Check cookies to see if next-auth session token exists
        const cookieStore: any = await getCookieData();
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
                const fetchedLiteraturePrompts = await fetchLiteraturePromptById(promptId);

                if ("response" in fetchedLiteraturePrompts) {

                    let literaturePromptAndContent: any = {
                        "prompt": null,
                        "content": null
                    };

                    if (fetchedLiteraturePrompts.response.length > 0) {
                        const prompt = fetchedLiteraturePrompts.response[0];

                        // Return forbidden response in the case where the content exists,
                        // but does not belong to the current user
                        if (prompt.user_id !== userId) {
                            return NextResponse.json({
                                "error": "This content was not generated by you."
                            }, {
                                status: 403
                            });
                        }

                        // Fetch user content for literature prompt 
                        const fetchedLiteratureContentForPrompt = await fetchLiteratureContentForPrompt(prompt.id);

                        // Get literature prompt content type lookup data
                        const literatureContentTypeRes: any = await getLiteratureContentTypeById(prompt.content_type);
                        let finalLiteratureContentType = prompt.content_type;
                        if ("response" in literatureContentTypeRes) {
                            finalLiteratureContentType = literatureContentTypeRes.response[0];
                        }

                        // Get authenticated url if image was used in prompt
                        let authenticatedImageUrl: any = null;
                        if (prompt.image_path) {
                            const generatedSignedUrl = await generateSignedUrlFile(process.env.GCP_CONTENT_RESULTS_BUCKET!, prompt.image_path)
                            authenticatedImageUrl = "url" in generatedSignedUrl ? generatedSignedUrl.url : "";
                        }

                        let finalContent: any = null;
                        if ("response" in fetchedLiteratureContentForPrompt) {
                            finalContent = fetchedLiteratureContentForPrompt.response[0];
                        }

                        literaturePromptAndContent = {
                            "prompt": {
                                ...prompt,
                                "content_type": finalLiteratureContentType,
                                "image_path": authenticatedImageUrl
                            },
                            "content": prompt.success === 1 ? finalContent : null
                        }
                    }

                    return NextResponse.json({
                        "response": literaturePromptAndContent
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
        console.log(`Oops. There is an error on our server.`);
        return NextResponse.json({
            "error": error.message
        }, {
            status: 500
        });
    }
}