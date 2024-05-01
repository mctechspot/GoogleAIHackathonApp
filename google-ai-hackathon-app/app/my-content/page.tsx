"use client"
import { useContext, useEffect, useState } from "react"
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Navigation/Header";
import Footer from "@/app/components/Navigation/Footer";
import UserPromptForm from "@/app/components/Forms/UserPromptForm";
import GeneratedContent from "@/app/components/Content/GeneratedContent";
import { UserFormProps, UserFormType } from "@/app/types/Forms";
import {
    GeneratedContentError,
    GeneratedLiteratureContentSuccess,
    GeneratedArtContentSuccess,
    GeneratedContentWarnings
} from "@/app/types/Response";
import { ContentLookupDataProps, ContentLookupDataError } from "@/app/types/ContentLookupData"
import { ThemeContext } from "@/app/components/Layouts/MainLayout"
import UserSideBar from "@/app/components/User/UserSideBar"
import LoadSpinner from "@/app/components/Loaders/LoadSpinner"
import GeneratedLiteratureContentHistory from "@/app/components/Content/GeneratedLiteratureContentHistory"
import GeneratedArtContentHistory from "@/app/components/Content/GeneratedArtContentHistory"
import { GeneratedLiteratureHistoryListType, GeneratedArtHistoryListType, ContentHistoryError } from "@/app/types/ContentHistory"

export default function MyContentPage() {
    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const [userPrompt, setUserPrompt] = useState<UserFormProps>({
        "prompt": "",
        "image": null,
        "content_type": "1",
        "orientation": "1"
    });
    const [contentGenerationRunning, setContentGenerationRunning] = useState<boolean>(false);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContentError | GeneratedLiteratureContentSuccess | GeneratedArtContentSuccess | GeneratedContentWarnings | null>(null);
    const [contentCategory, setContentCategory] = useState<number>(1);
    const [literatureContentHistory, setLiteratureContentHistory] = useState<GeneratedLiteratureHistoryListType | ContentHistoryError | null>(null);
    const [artContentHistory, setArtContentHistory] = useState<GeneratedArtHistoryListType | ContentHistoryError | null>(null);

    useEffect(() => {
        fetchLiteratureContent();
        fetchArtContent();
    }, []);

    // Function to fetch literature content history
    const fetchLiteratureContent = async (): Promise<void> => {
        try {
            const literatureContentHistoryRes = await fetch(`/api/content-history/fetch-literature-content-history`, {
                "method": "GET"
            });
            const literatureContentHistoryJson = await literatureContentHistoryRes.json();
            setLiteratureContentHistory(literatureContentHistoryJson);
        } catch (error: any) {
            console.log(`Error fetching literature content history: ${error.message}.`);
        }
    }

    // Function to fetch art content history
    const fetchArtContent = async (): Promise<void> => {
        try {
            const artContentHistoryRes = await fetch(`/api/content-history/fetch-art-content-history`, {
                "method": "GET"
            });
            const artContentHistoryJson = await artContentHistoryRes.json();
            setArtContentHistory(artContentHistoryJson);
            console.log(artContentHistoryJson);
        } catch (error: any) {
            console.log(`Error fetching art content history: ${error.message}.`);
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
                
                <p className={`${lightTheme ? ("text-green-text") : ("text-white")} text-center font-black`}>My Content</p><br />

                    {literatureContentHistory && artContentHistory ? (
                        <>
                            {/* Tab to switch between literary and art content history */}
                            <div className={`flex justify-center items-center gap-5 f-full`}>
                                <div className={`${contentCategory === 1 ? (`bg-green-standard text-green-dark`) : (lightTheme ? ("text-green-dark") : ("text-white"))} font-black p-2 rounded cursor-pointer`}
                                    onClick={() => setContentCategory(1)}>Literature</div>
                                <div className={`${contentCategory !== 1 ? ("bg-green-standard") : (lightTheme ? ("text-green-dark") : ("text-white"))} font-black p-2 rounded cursor-pointer`}
                                    onClick={() => setContentCategory(2)}>Art</div>
                            </div><br />

                            {contentCategory === 1 ? (
                                <>
                                    {"response" in literatureContentHistory ? (
                                        <>
                                            <GeneratedLiteratureContentHistory response={literatureContentHistory.response} />
                                        </>
                                    ) : ("")}
                                </>
                            ) :
                                (
                                    "response" in artContentHistory ? (
                                        <>
                                            <GeneratedArtContentHistory response={artContentHistory.response} />
                                        </>
                                    ) : ("")
                                )}
                        </>
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
