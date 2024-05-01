"use client"
import { useContext, useEffect, useState } from "react"
import Link from "next/link";
import Header from "@/app/components/Navigation/Header";
import Footer from "@/app/components/Navigation/Footer";
import { ThemeContext } from "@/app/components/Layouts/MainLayout"
import GeneratedArtContent from "@/app/components/Content/GeneratedArtContent"
import { GeneratedArtContentType, ContentHistoryError } from "@/app/types/ContentHistory"
import { MdError } from "react-icons/md";
import LoadSpinner from "@/app/components/Loaders/LoadSpinner"

export default function ArtContentPage({ params }: { params: { prompt_id: string } }) {
    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const [artContent, setArtContent] = useState<GeneratedArtContentType | ContentHistoryError | null>(null);
    const promptId: string = params.prompt_id;

    useEffect(() => {
        fetchArtContent();
    }, []);

    // Function to fetch art content
    const fetchArtContent = async (): Promise<void> => {
        try {
            const literatureContentRes = await fetch(`/api/content-history/fetch-unique-art-content/${promptId}`, {
                "method": "GET"
            });
            const literatureContentJson = await literatureContentRes.json();
            setArtContent(literatureContentJson);
        } catch (error: any) {
            console.log(`Error fetching literature content history: ${error.message}.`);
        }
    }

    return (
        <>
            <div className={`page-container relative`}>

                {/* Header */}
                <div>
                    <Header />
                </div>

                <div className={"mx-20 mb-5 max-[450px]:mx-10 fade-in"}>

                    {artContent ? (
                        "response" in artContent ? (
                            <>
                                <div className={`fade-in`}>
                                    <GeneratedArtContent response={artContent.response} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`flex justify-center items-center gap-2 \
                                                        ${lightTheme ? ("text-red-error") : ("text-red-error-medium")} font-black`}>
                                    <div><MdError /></div>
                                    <p>
                                        {artContent.error}
                                    </p>
                                </div>
                            </>
                        )
                    ) : (
                        <>
                            <LoadSpinner />
                        </>
                    )}

                </div>

                {/* Footer */}
                <div className={"sticky"}>
                    <Footer />
                </div>

            </div >
        </>
    );
}
