import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import { uuidv7 } from "uuidv7";

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const payload = await request.formData();

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
        } else {
            userData = null;
        }

        const generateContentRes = await fetch(`${process.env.FASTAPI_ENDPOINT}/generate-text-from-image`, {
            "body": payload,
            "method": "POST"
        });

        const generateContentJson = await generateContentRes.json();

        const status: number = "warning" in generateContentJson ? 400 : "error" in generateContentJson ? 500 : 200;

        return NextResponse.json(generateContentJson, { status: status });

    } catch (error: any) {
        console.log(`Error generating text content from prompt and image:${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}