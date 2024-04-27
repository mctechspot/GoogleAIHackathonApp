import { pool } from '@/app/api/db/Constants'
import { getNowUtc } from '@/app/utils/Dates'

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
        console.log(`Error adding user: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to add literature prompt
/*export const addLiteraturePrompt = async (id: string, promptDetails: any): Promise<any> => {
    try {

        // Possible query success message
        let successMessage: string = "";

        // Query to add new user
        const addLiteraturePromptQuery = {
            name: "add-literature-prompt",
            text: "INSERT INTO literature_prompts (id, prompt, image_path, content_type) SELECT $1, $2, $3, $4 \
            WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = $5)",
            values: [id, email, now, now, email]
        };

        // Attempt to register user
        const addUserRes = await pool.query(addUserQuery);

        // Return success message for adding new user
        if (addUserRes.rowCount && addUserRes.rowCount === 1) {
            successMessage = "Successfully registered user."
            return { "response": successMessage };
        }

        // Return error message if neither user registration nor last login update query works
        return {"error": "Error registering user or updating login date."}

    } catch (error: any) {
        // Return error
        console.log(`Error adding user: ${error.message}`);
        return { "error": error.message };
    }
}*/
