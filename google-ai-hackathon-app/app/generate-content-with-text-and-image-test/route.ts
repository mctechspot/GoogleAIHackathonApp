import { NextRequest, NextResponse } from "next/server"
import { checkImageCompatibility } from "@/app/utils/Files"
import { generateTextFromTextPrompt, generateTextFromTextAndImagePrompt } from "@/app/api/genAi/GenerativeAIFunctions"

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const payload = await request.formData();

        const contentTypeId: string = payload.get("content_type") as unknown as string;
        const rawImage: File | null = payload.get("image") as unknown as File | null;
        const promptText: string = payload.get("prompt") as unknown as string;
        const contentType: string = "story";

        // Instantiate final response
        let finalResponse: any = null;

        // Check if image field is not null
        if (rawImage) {

            // Check for image warnings and return bad request error if image is incompatible
            const imageWarnings: string[] = checkImageCompatibility(rawImage);
            console.log("IMAGE WARNINGS: ", imageWarnings);
            if (imageWarnings.length > 0) {
                return NextResponse.json({
                    "warnings": imageWarnings
                }, {
                    status: 400
                });
            }

            // Generate content with text and image prompt
            finalResponse = await generateTextFromTextAndImagePrompt(contentType, promptText, rawImage);
            console.log("YESSS: ", finalResponse);
        } else {
            // Generate content with only text prompt
            finalResponse = await generateTextFromTextPrompt(contentType, promptText);
            console.log("FINAL:   ", finalResponse);
        }

        return NextResponse.json(finalResponse, {
            status: 200
        });
    } catch (error: any) {
        console.log(`Error: ${error.message}`);
        return NextResponse.json({
            "error": error.message
        }, {
            status: 500
        });
    }
}