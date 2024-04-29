import { pool } from '@/app/api/db/Constants'
import { getNowUtc } from '@/app/utils/Dates'
import { uuidv7 } from "uuidv7";

// Function to get all art styles
export const getArtStyles = async (): Promise<any> => {
    try {

        // Query to get art styles
        const getArtStylesQuery = {
            name: "get-art-styles",
            text: "SELECT * from art_styles",
            values: []
        };

        // Attempt to get art styles
        const artStylesRes = await pool.query(getArtStylesQuery);
        let success: boolean = false;
        if (artStylesRes.rowCount) {
            success = true;
            return { "response": artStylesRes.rows };
        }
        return { "error": "Error getting art styles." }

    } catch (error: any) {
        // Return error
        console.log(`Error getting art styles: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to get all art styles
export const getArtStyleById = async (artStyleId: string): Promise<any> => {
    try {

        // Query to get art style by id
        const getArtStyleByIdQuery = {
            name: "get-art-style-by-id",
            text: "SELECT * from art_styles WHERE id = $1",
            values: [artStyleId]
        };

        // Attempt to get art style by id
        const artStyleByIdRes = await pool.query(getArtStyleByIdQuery);
        let success: boolean = false;
        if (artStyleByIdRes.rowCount) {
            success = true;
            return { "response": artStyleByIdRes.rows };
        }
        return { "error": "Error getting art style by id." }

    } catch (error: any) {
        // Return error
        console.log(`Error getting art style by id: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to get image orientations
export const getImageOrientations = async (): Promise<any> => {
    try {

        // Query to get image orientations
        const getImageOrientationsQuery = {
            name: "get-image-orientations",
            text: "SELECT * from image_orientations",
            values: []
        };

        // Attempt to get image orientations
        const imageOrientationsRes = await pool.query(getImageOrientationsQuery);
        let success: boolean = false;
        if (imageOrientationsRes.rowCount) {
            success = true;
            return { "response": imageOrientationsRes.rows };
        }
        return { "error": "Error getting image orientations." }

    } catch (error: any) {
        // Return error
        console.log(`Error getting image orientations: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to get image orientations
export const getImageOrientationById = async (orientationId: string): Promise<any> => {
    try {

        // Query to get image orientation by id
        const getImageOrientationByIdQuery = {
            name: "get-image-orientation-by-id",
            text: "SELECT * from image_orientations WHERE id = $1",
            values: [orientationId]
        };

        // Attempt to get image orientation by id
        const imageOrientationByIdRes = await pool.query(getImageOrientationByIdQuery);
        let success: boolean = false;
        if (imageOrientationByIdRes.rowCount) {
            success = true;
            return { "response": imageOrientationByIdRes.rows };
        }
        return { "error": "Error getting image orientation by id." }

    } catch (error: any) {
        // Return error
        console.log(`Error getting image orientation by id: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to add art prompt
export const addArtPrompt = async (
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
        if ("warnings" in response) {
            success = 0;
            warning_or_error = 1;
            warning_or_error_message = response.warnings.join(". ");
        }

        if ("error" in response) {
            success = 0;
            warning_or_error = 2;
            warning_or_error_message = response.error;
        }

        const responseTimestamp: any = getNowUtc();

        // Query to add new art prompt
        const addArtPromptQuery = {
            name: "add-art-prompt",
            text: "INSERT INTO art_prompts (id, user_id, prompt, art_style, orientation, request_timestamp, \
            response_timestamp, success, warning_or_error, warning_or_error_message) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
            values: [promptId, userId, payload.prompt, payload.style, payload.orientation,
                requestTimestamp, responseTimestamp, success, warning_or_error, warning_or_error_message]
        };

        // Attempt to add new art prompt
        const addArtPromptRes = await pool.query(addArtPromptQuery);

        // Return success message for adding new art prompt
        if (addArtPromptRes.rowCount && addArtPromptRes.rowCount === 1) {
            successMessage = "Successfully added art prompt."
            return {
                "response": successMessage,
                "prompt_id": promptId
            };
        }

        // Return error message if neither user registration nor last login update query works
        return { "error": "Error adding art prompt." }

    } catch (error: any) {
        // Return error
        console.log(`Error adding art prompt: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to add generated art content
export const addGeneratedArtContent = async (
    userId: string,
    promptId: string,
    generatedContent: any
): Promise<any> => {
    try {

        // Possible query success message
        let successMessage: string = "";
        const contentId: string = uuidv7();

        // Query to add new user
        const addGeneratedArtContentQuery = {
            name: "add-generated-art-content",
            text: "INSERT INTO generated_art (id, user_id, prompt, image_no, image_path) \
            VALUES ($1, $2, $3, $4, $5);",
            values: [contentId, userId, promptId, generatedContent.image_no, generatedContent.image_path]
        };

        // Attempt to add new generated art content
        const addGeneratedArtContentRes = await pool.query(addGeneratedArtContentQuery);

        // Return success message for adding new generated art content
        if (addGeneratedArtContentRes.rowCount && addGeneratedArtContentRes.rowCount === 1) {
            successMessage = "Successfully added generated literature content."
            return {
                "response": addGeneratedArtContentRes,
                "content_id": contentId
            };
        }

        // Return error message if neither user registration nor last login update query works
        return { "error": "Error adding generated art content." }

    } catch (error: any) {
        // Return error
        console.log(`Error adding generated art content: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to fetch art prompts for a user
export const fetchArtPromptsForUser = async (userId: string): Promise<any> => {
    try {

        // Query to fetch art prompts for user
        const getArtPromptsForUserQuery = {
            name: "get-art-prompts-for-user",
            text: "SELECT * from art_prompts where user_id = $1 ORDER BY request_timestamp DESC",
            values: [userId]
        };

        // Attempt to fetch art prompts for user
        const artPromptsForUser = await pool.query(getArtPromptsForUserQuery);
        let success: boolean = false;
        if (artPromptsForUser.rowCount) {
            success = true;
            return { "response": artPromptsForUser.rows };
        }
        return { "response": [] }

    } catch (error: any) {
        // Return error
        console.log(`Error getting art prompts for user: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to fetch art prompt by id
export const fetchArtPromptById = async (promptId: string): Promise<any> => {
    try {

        // Query to fetch art prompt by id
        const getArtPromptByIdQuery = {
            name: "get-art-prompt-by-id",
            text: "SELECT * from art_prompts where id = $1",
            values: [promptId]
        };

        // Attempt to fetch art prompt by id
        const artPromptById = await pool.query(getArtPromptByIdQuery);
        let success: boolean = false;
        if (artPromptById.rowCount) {
            success = true;
            return { "response": artPromptById.rows };
        }
        return { "response": [] }

    } catch (error: any) {
        // Return error
        console.log(`Error getting art prompt by id: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to fetch art content for a prompt
export const fetchArtContentForPrompt = async (promptId: string): Promise<any> => {
    try {
        // Query to fetch art content for prompt
        const getArtContentForPromptQuery = {
            name: "get-art-content-for-prompt",
            text: "SELECT * from generated_art WHERE prompt = $1",
            values: [promptId]
        };

        // Attempt to fetch art content for prompt
        const artContentForPrompt = await pool.query(getArtContentForPromptQuery);
        let success: boolean = false;
        if (artContentForPrompt.rowCount) {
            success = true;
            return { "response": artContentForPrompt.rows };
        }
        return { "response": [] }
    } catch (error: any) {
        // Return error
        console.log(`Error getting art content for prompt: ${error.message}`);
        return { "error": error.message };
    }
}