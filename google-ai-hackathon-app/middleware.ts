import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {

    // On home page, check if Google user session is present in order to redirect user to generate page
    if (request.nextUrl.pathname === "/") {
        const cookieStore = cookies();
        const nextAuthSessionCookie: any = cookieStore.get('next-auth.session-token');

        // Get user credentials from next-auth session token if it exsists
        let userData: any = null;
        if (nextAuthSessionCookie !== undefined && nextAuthSessionCookie && "value" in nextAuthSessionCookie) {
            userData = await decode({
                token: nextAuthSessionCookie.value,
                secret: process.env.NEXTAUTH_SECRET!,
            });
            const userInDbRes = await checkForUserInDb(userData);
            // If valid Google user session is found, redirect to /generate page
            return NextResponse.redirect(new URL('/generate', request.url))
        } else {
            userData = null;
        }
    }
}

// Function to check if user exist in database after initiating Google session
const checkForUserInDb = async (userData: any): Promise<any> => {
    try {
        console.log(process.env.DOMAIN);
        const checkForUser = await fetch(`${process.env.DOMAIN!}/api/check-for-user-in-db`, {
            "method": "POST",
            "body": JSON.stringify(userData)
        });
        const checkForUserJson = await checkForUser.json();
        console.log(checkForUserJson);
        return { "response": checkForUserJson };

    } catch (error: any) {
        console.log(`Error checking if user exists in database after login : ${error.message}`);
        return { "error": error.message };
    }
};