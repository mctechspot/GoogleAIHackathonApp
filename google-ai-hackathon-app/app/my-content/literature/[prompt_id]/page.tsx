"use client"
import { useContext, useEffect, useState } from "react"
import Link from "next/link";
import Header from "@/app/components/Navigation/Header";
import Footer from "@/app/components/Navigation/Footer";
import { ThemeContext } from "@/app/components/Layouts/MainLayout"
import GeneratedLiteratureContent from "@/app/components/Content/GeneratedLiteratureContent"
import { GeneratedLiteratureContentType, ContentHistoryError } from "@/app/types/ContentHistory"
import { MdError } from "react-icons/md";

export default function LiteratureContentPage({ params }: { params: { prompt_id: string } }) {
    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const [literatureContent, setLiteratureContent] = useState<GeneratedLiteratureContentType | ContentHistoryError | null>(null);
    const promptId: string = params.prompt_id;

    useEffect(() => {
        fetchLiteratureContent();
    }, []);

    // Function to fetch literature content history
    const fetchLiteratureContent = async (): Promise<void> => {
        try {
            const literatureContentRes = await fetch(`/api/content-history/fetch-unique-literature-content/${promptId}`, {
                "method": "GET"
            });
            const literatureContentJson = await literatureContentRes.json();
            setLiteratureContent(literatureContentJson);
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

                    {literatureContent ? (
                        "response" in literatureContent ? (
                            <>
                                <div className={`fade-in`}>
                                    <GeneratedLiteratureContent response={literatureContent.response} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`flex justify-center items-center gap-2 \
                                                        ${lightTheme ? ("text-red-error") : ("text-red-error-medium")} font-black`}>
                                    <div><MdError /></div>
                                    <p>
                                        {literatureContent.error}
                                    </p>
                                </div>
                            </>
                        )
                    ) : ("")}

                </div>

                {/* Footer */}
                <div className={"sticky"}>
                    <Footer />
                </div>

            </div >
        </>
    );
}
