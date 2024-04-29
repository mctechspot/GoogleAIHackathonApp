import { google } from 'googleapis';
import { NextRequest, NextResponse } from "next/server";
import { base64ToJSON } from "@/app/utils/DataParsing";

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const payload = await request.json();

        // Decode GCP Service Account key string to JSON format to get credentials
        const gcpServiceAccountJson = base64ToJSON(process.env.GCP_SA_KEY_STRING!);

        // Create JWT client to generate token using GCP Service account credentials
        const jwtClient = new google.auth.JWT({
            email: gcpServiceAccountJson.client_email,
            key: gcpServiceAccountJson.private_key,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        // Generate JWT access token to authorise image generation request
        const tokens = await jwtClient.authorize();
        const accessToken = tokens.access_token;

        const ratio: string = "1:1";

        // Create request body for image generation
        const requestBody = {
            "instances": [
                {
                    "prompt": payload.prompt
                }
            ],
            "parameters": {
                "sampleCount": 3,
                "aspectRatio": ratio,
                "addWatermark": false,
            }
        };

        // Construct image generation request url with GCP project data variables
        const requestUrl: string = `https://${process.env.GCP_LOCATION}-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_LOCATION}/publishers/google/models/imagegeneration@006:predict`;

        // Make the HTTP request with the generated token
        const imageGenerationRequest = await fetch(requestUrl, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        // Initialise generation response to error response
        // subject to change if image generation is successgful or if warning messages are found
        let generationResponse: any = {"error": "Something went wrong"};

        // Get json for image generation response
        const imageGenerationJson = await imageGenerationRequest.json();
        console.log("IMAGE GEN: ", imageGenerationJson);
        let base64Images: string[] = [];
        if ("predictions" in imageGenerationJson) {
            base64Images = imageGenerationJson.predictions.map((prediction: any, index: number) => {
                return prediction.bytesBase64Encoded
            });
            generationResponse = { "response": base64Images }
        }

        // Check for sensitive input warnings
        if ("error" in imageGenerationJson) {
            let warnings: string[] = [];

            // Check for sensitive input error and add them to warning key in generation response
            if (imageGenerationJson.error.message === "Image generation failed with the following error: The prompt could not be submitted. Your current safety settings for person/face generation prohibited one or more words in this prompt. If you think this was an error, send feedback.") {
                warnings = ["Content blocked for ethical reasons. Please ensure that your prompt does not elicit drugs, violence or sensual content."];
            }
            if (imageGenerationJson.error.message === "Image generation failed with the following error: The prompt could not be submitted. This prompt contains sensitive words that violate Google's Responsible AI practices. Try rephrasing the prompt. If you think this was an error, send feedback.") {
                warnings = ["Content blocked for ethical reasons. Please ensure that your prompt does not elicit drugs, violence or sensual content."];
            }

            if (warnings.length > 0) {
                generationResponse = { "warnings": warnings }
            }
        }

        
        // Return final response
        const status: number = "warning" in generationResponse ? 400 : "error" in generationResponse ? 500 : 200;
        return NextResponse.json(generationResponse, {
            status: status 
        });

    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        return NextResponse.json({
            "error": error.message
        }, {
            status: 500
        });
    }
}
