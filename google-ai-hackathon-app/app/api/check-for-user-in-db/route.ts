import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt';
import { uuidv7 } from "uuidv7";
import { addUser } from "@/app/api/db/Users"
import { convertTimestampToMoment, getNowUtc } from "@/app/utils/Dates"

export async function POST(request: NextRequest, response: NextResponse) {
    try {

        const payload = await request.json();
        const id: string = uuidv7();
        const addUserRes = await addUser(id, payload.email, getNowUtc());

        // Success response
        if ("response" in addUserRes) {
            return NextResponse.json(addUserRes, {
                status: 200
            });
        }

        return NextResponse.json({ "response": "Error adding or checking for user in database." }, {
            status: 500
        });

    } catch (error: any) {
        console.log(`Error adding or checking for user in database :${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}