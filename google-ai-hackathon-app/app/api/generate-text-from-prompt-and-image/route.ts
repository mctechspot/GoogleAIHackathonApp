import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, response: NextResponse){
    try{
        const payload = await request.formData();
        console.log(payload);

        const generateContentRes = await fetch(`${process.env.FASTAPI_ENDPOINT}/generate-text-from-image`, {
            "body": payload,
            "method": "POST"
        });

        const generateContentJson = await generateContentRes.json();
        
        const status: number = "warning" in generateContentJson ? 400 : "error" in generateContentJson ? 500 : 200;

        return NextResponse.json(generateContentJson, {status: status});

    }catch(error: any){
        console.log(`Error generating text content from prompt and image:${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}