import { pool } from '@/app/api/db/Constants'
import { getNowUtc } from '@/app/utils/Dates'

// Function to get art styles
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
        return {"error": "Error getting art styles."}
        
    } catch (error: any) {
        // Return error
        console.log(`Error getting art styles: ${error.message}`);
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
        return {"error": "Error getting image orientations."}
        
    } catch (error: any) {
        // Return error
        console.log(`Error getting image orientations: ${error.message}`);
        return { "error": error.message };
    }
}
