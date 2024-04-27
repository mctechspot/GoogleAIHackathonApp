import { pool } from '@/app/api/db/Constants'
import { getNowUtc } from '@/app/utils/Dates'
import { uuidv7 } from "uuidv7";

// Function to add literature prompt
export const getLiteratureContentTypes = async (): Promise<any> => {
    try {

        // Query to get literature content types
        const getLiteratureContentTypesQuery = {
            name: "get-literature-content-types",
            text: "SELECT * from literature_content_types",
            values: []
        };

        // Attempt to get literature content types
        const literatureContentTypesRes = await pool.query(getLiteratureContentTypesQuery);
        let success: boolean = false;
        if (literatureContentTypesRes.rowCount) {
            success = true;
            return { "response": literatureContentTypesRes.rows };
        }
        return {"error": "Error getting literature content types."}

    } catch (error: any) {
        // Return error
        console.log(`Error getting literature content types: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to add literature prompt
export const addLiteraturePrompt = async (
    promptId: string,
    userId: string, 
    requestTimestamp: any, 
    payload: any, 
    response: any
): Promise<any> => {
    try {

        // Possible query success message
        let successMessage: string = "";

        let success: number = 1;
        let warning_or_error: number | null = null;
        let warning_or_error_message: string | null = null;
        if("warnings" in response){
            success = 0;
            warning_or_error = 1;
            warning_or_error_message = response.warnings.join(". ");
        }

        if("error" in response){
            success = 0;
            warning_or_error = 2;
            warning_or_error_message = response.error;
        }
        
        //const promptId: string = uuidv7();
        const responseTimestamp: any = getNowUtc();

        // Query to add new user
        const addLiteraturePromptQuery = {
            name: "add-literature-prompt",
            text: "INSERT INTO literature_prompts (id, user_id, prompt, image_path, content_type, request_timestamp, \
            response_timestamp, success, warning_or_error, warning_or_error_message) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
            values: [promptId, userId, payload.prompt, payload.image, payload.content_type, requestTimestamp, responseTimestamp, 
                success, warning_or_error, warning_or_error_message]
        };

        // Attempt to register user
        const literaturePromptRes = await pool.query(addLiteraturePromptQuery);

        // Return success message for adding new user
        if (literaturePromptRes.rowCount && literaturePromptRes.rowCount === 1) {
            successMessage = "Successfully added literature prompt."
            return { 
                "response": successMessage,
                "prompt_id":  promptId
            };
        }

        // Return error message if neither user registration nor last login update query works
        return {"error": "Error adding literature prompt."}

    } catch (error: any) {
        // Return error
        console.log(`Error adding literature prompt: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to add generated literature content
export const addGeneratedLiteratureContent = async (user_id: string, prompt_id: string, payload: any, generatedContent: any): Promise<any> => {
    try {

        // Possible query success message
        let successMessage: string = "";
        const contentId: string = uuidv7();

        // Query to add new user
        const addGeneratedLiteratureContentQuery = {
            name: "add-generated-literature-content",
            text: "INSERT INTO generated_literature (id, user_id, prompt, content) \
            VALUES ($1, $2, $3, $4);",
            values: [contentId, user_id, prompt_id, generatedContent.response]
        };

        // Attempt to register user
        const addGeneratedLiteratureContentRes = await pool.query(addGeneratedLiteratureContentQuery);

        // Return success message for adding new user
        if (addGeneratedLiteratureContentRes.rowCount && addGeneratedLiteratureContentRes.rowCount === 1) {
            successMessage = "Successfully added generated literature content."
            return { "response": addGeneratedLiteratureContentRes };
        }

        // Return error message if neither user registration nor last login update query works
        return {"error": "Error adding generated literature content."}

    } catch (error: any) {
        // Return error
        console.log(`Error adding generated literature content: ${error.message}`);
        return { "error": error.message };
    }
}