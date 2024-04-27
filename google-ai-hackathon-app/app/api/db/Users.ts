import { pool } from '@/app/api/db/Constants'
import { getNowUtc } from '@/app/utils/Dates'

// Function to add user
export const addUser = async (id: string, email: string, now: any): Promise<any> => {
    try {

        // Possible query success message
        let successMessage: string = "";

        // Query to add new user
        const addUserQuery = {
            name: "add-user",
            text: "INSERT INTO users (id, email, created_at, last_login) SELECT $1, $2, $3, $4 \
            WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = $5)",
            values: [id, email, now, now, email]
        };

        // Attempt to register user
        const addUserRes = await pool.query(addUserQuery);

        // Return success message for adding new user
        if (addUserRes.rowCount && addUserRes.rowCount === 1) {
            console.log("TTTT: ", addUserRes.rowCount);
            successMessage = "Successfully registered user."
            return { "response": successMessage };
        } else { // If user already exists update last  login datae
            const updateUserLastLoginRes = await updateUserLastLogin(email, now);
            if ("response" in updateUserLastLoginRes) {
                successMessage = "Successfully updated user last login timestamp."
                return { "response": successMessage };
            }
        }

        // Return error message if neither user registration nor last login update query works
        return {"error": "Error registering user or updating login date."}

    } catch (error: any) {
        // Return error
        console.log(`Error adding user: ${error.message}`);
        return { "error": error.message };
    }
}

// Function to update user last login timestamp
export const updateUserLastLogin = async (email: string, last_login: any): Promise<any> => {
    try {
        // Query to update user last login timestamp
        const updateUserLastLoginQuery = {
            name: "upate-user-last-login",
            text: "UPDATE users SET last_login = $1 WHERE email = $2",
            values: [last_login, email]
        };
        const updateUserLastLoginRes = await pool.query(updateUserLastLoginQuery);
        let success: boolean = false;
        if (updateUserLastLoginRes.rowCount) {
            success = true;
            return { "response": updateUserLastLoginRes.rows };
        }
        return {"error": "Error updating user last login timestamp."}
    } catch (error: any) {
        // Return error
        console.log(`Error updating user last login: ${error.message}`);
        return { "error": error.message };
    }
}


