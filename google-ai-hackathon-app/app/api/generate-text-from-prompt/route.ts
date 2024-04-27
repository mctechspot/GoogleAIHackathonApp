import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import { uuidv7 } from "uuidv7";
import { getUserIdFromEmail } from "@/app/api/db/Users"

export async function POST(request: NextRequest, response: NextResponse){
    try{
        const payload = await request.json();

        // Check cookies to see if next-auth session token exists
        const cookieStore = cookies()
        const nextAuthSessionCookie: any = cookieStore.get('next-auth.session-token');

        // Get user credentials from next-auth session token if it exsists
        let userData: any = null;
        if (nextAuthSessionCookie !== undefined && nextAuthSessionCookie && "value" in nextAuthSessionCookie) {
            userData = await decode({
                token: nextAuthSessionCookie.value,
                secret: process.env.NEXTAUTH_SECRET!,
            });
            const userIdFromEmail = await getUserIdFromEmail(userData.email);
            console.log(userIdFromEmail);
        } else {
            userData = null;
        }

        const generateContentRes = await fetch(`${process.env.FASTAPI_ENDPOINT}/generate-text`, {
            "body": JSON.stringify(payload),
            "method": "POST",
            "headers": {
                "Content-type": "application/json"
            }
        });

        const generateContentJson = await generateContentRes.json();
        
        const status: number = "warning" in generateContentJson ? 400 : "error" in generateContentJson ? 500 : 200;

        return NextResponse.json(generateContentJson, {status: status});

    }catch(error: any){
        console.log(`Error generating text content from prompt :${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}