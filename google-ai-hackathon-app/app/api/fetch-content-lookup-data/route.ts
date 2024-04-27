import { NextRequest, NextResponse } from "next/server"
import { getLiteratureContentTypes } from "@/app/api/db/Literature"
import { getArtStyles, getImageOrientations } from "@/app/api/db/Art"

export async function GET(request: NextRequest) {
    try {
        const literatureContentTypes = await getLiteratureContentTypes();
        const artStyles = await getArtStyles();
        const imageOrientations = await getImageOrientations();

        return NextResponse.json({
            "literature_content_types": literatureContentTypes.response.map((contentType: any, index: number) => {
                return {
                    "key": contentType.id,
                    "value": contentType.content_type,
                }
            }),
            "art_styles": artStyles.response.map((artStyle: any, index: number) => {
                return {
                    "key": artStyle.id,
                    "value": artStyle.style,
                }
            }),
            "image_orientations": imageOrientations.response.map((orientation: any, index: number) => {
                return {
                    "key": orientation.id,
                    "value": orientation.orientation,
                }
            }),
        }, {
            status: "response" in literatureContentTypes && "response" in artStyles && "response" in imageOrientations ? 200 : 500
        });
    } catch (error: any) {
        console.log(`Error fetching lookup data: ${error.message}`);
        return NextResponse.json({
            "error": error.message
        }, {
            status: 500
        });
    }
}