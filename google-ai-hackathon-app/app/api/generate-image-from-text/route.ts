import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, response: NextResponse){
    try{
        const payload = await request.json();

        const generateContentRes = await fetch(`${process.env.FASTAPI_ENDPOINT}/generate-image-from-text`, {
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
        console.log(`Error generating image from text prompt: ${error.message}.`)
        return NextResponse.json({
            "error": error.message,
        }, {
            status: 500
        });
    }
}