import {
    FunctionDeclarationSchemaType,
    HarmBlockThreshold,
    HarmCategory,
    VertexAI
} from '@google-cloud/vertexai';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { base64ToJSON } from "@/app/utils/DataParsing"
import { getImageTmpPathFromFile, filePathToBase64 } from "@/app/utils/Files"


// Intialise constants to run Generative AI models
const project = process.env.GCP_PROJECT_ID!;
const location = process.env.GCP_LOCATION!;
const saJson = base64ToJSON(process.env.GCP_SA_KEY_STRING!);
const textModel = 'gemini-1.0-pro';
const visionModel = 'gemini-1.0-pro-vision';

// Initialise Google Authentication credentials library
const authOptions = {
    credentials: {
        client_email: saJson.client_email,
        private_key: saJson.private_key,
    }
}

// Initialise Vertex AI Object
const vertexAI = new VertexAI({ project: project, location: location, googleAuthOptions: authOptions });
const generativeModelText = vertexAI.getGenerativeModel({
    model: textModel,
    safetySettings: [{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }],
    generationConfig: { maxOutputTokens: 256 },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const textFromTextAndImageModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });


// Function to generate text from only text prompt
export const generateTextFromTextPrompt = async (
    contentType: string,
    prompt: string
) => {

    try {
        // Construct string for final prompt with content type and user input prompt text
        const contentTypeFinal: string =  contentType === "poem" || contentType === "story" ? `${contentType} that rhymes` : contentType;
        console.log(contentTypeFinal);
        const finalPrompt: string = `Write a ${contentTypeFinal} with the following prompt: ${prompt}.
        Include an appropriate title in bold for the content generated in the final response.
        Do not cut the content off. It should be complete and fit under 1100 characters maximum.`

        // Build content parameters for generative AI model
        let requestContents: any = {
            contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
        };
        // Get response for prompt
        const response = await generativeModelText.generateContent(requestContents);

        // Initialise final response as error
        let finalResponse: any = {
            "error": "Something went wrong."
        };

        // Change final response to successful response if text is obtained
        if (response.response.candidates && response.response.candidates[0].content.parts[0].text) {
            finalResponse = {
                "response": response.response.candidates[0].content.parts[0].text
            };
        }

        return finalResponse;

    } catch (error: any) {
        // Return error response
        return { "error": error.message }
    }
}

// Function to generate text from text and image prompt (multimodal model)
export const generateTextFromTextAndImagePrompt = async (
    contentType: string,
    prompt: string,
    image: File,
) => {
    try {

        // Write image to location in /tmp
        const tmpImage = await getImageTmpPathFromFile(image);

        // If tmp image is successful continue with content generation
        if (tmpImage && "imageUUID" in tmpImage && "imageName" in tmpImage && "imagePath" in tmpImage) {

            // Convert image to base 64 string
            const fileBase64String = filePathToBase64(tmpImage.imagePath);

            // Create file parts for prompt
            const filePart: any = { inline_data: { data: fileBase64String, mimeType: image.type } };
            const imageParts: any = [filePart];

            // Construct final content generation prompt with content type and user input propt text
            const contentTypeFinal: string =  contentType === "poem" || contentType === "story" ? `${contentType} that rhymes` : contentType;
            console.log(contentTypeFinal);
            const final_prompt: string = `Write a ${contentTypeFinal} about this image with the following prompt: ${prompt}. 
            Include an appropriate title in bold for the content generated in the final response.
            Do not cut the content off. It should be complete and fit under 1100 characters maximum.`;
            const result = await textFromTextAndImageModel.generateContent([final_prompt, ...imageParts]);
            const response = await result.response;

            // Return successful response
            return {
                "response": response.text()
            }
        }
        // Return error response
        return { "error": "Error generating text from text and image and prompt." };
    } catch (error: any) {

        // Return warning if user is located some place where Gemini API is unavailable
        if (error.message === "[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent: [400 Bad Request] User location is not supported for the API use.") {
            return {
                "warnings": ["Sorry. The API used for this prompt is not available in your location. Try using a VPN to connect to a foreign network."]
            };
        }

        // Return error response
        return { "error": error.message };
    }
}