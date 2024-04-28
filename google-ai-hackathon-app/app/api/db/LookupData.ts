import { pool } from '@/app/api/db/Constants'
import { getNowUtc } from '@/app/utils/Dates'
import { uuidv7 } from "uuidv7";

// Function to get art styles
export const getLiteratureContentTypes = async (): Promise<any> => {
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