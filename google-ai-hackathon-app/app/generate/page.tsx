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

export default function GenerateScreen() {
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
    const [contentLookupData, setContentLookupData] = useState<ContentLookupDataProps | ContentLookupDataError | null>(null);


    useEffect(() => {
        fetchContentLookupData();
    }, []);

    const fetchContentLookupData = async (): Promise<void> => {
        try {
            const contentLookupDataRes = await fetch(`/api/fetch-content-lookup-data`, {
                "method": "GET"
            });
            const contentLookupDataJson = await contentLookupDataRes.json();
            if(!("error" in contentLookupDataJson)){
                setUserPrompt({...userPrompt, 
                    content_type: contentLookupDataJson.literature_content_types[0].key,
                    orientation: contentLookupDataJson.image_orientations[0].key
                })
            }
            setContentLookupData(contentLookupDataJson);
        } catch (error: any) {
            console.log(`Error fetching content lookup data: ${error.message}.`);
        }
    }

    return (
        <>
            <div className={`page-container relative`}>

                {/* Header */}
                <div>
                    <Header />
                </div>

                {contentLookupData ? (

                    !("error" in contentLookupData) ? (
                        <>
                            <div>
                                <div>

                                    <div className={"mx-20 mb-5 max-[450px]:mx-10 fade-in"}>

                                        {/* Tab to switch between literary and art content generators */}
                                        <div className={`flex justify-center items-center gap-5 f-full`}>
                                            <div className={`${contentCategory === 1 ? (`bg-green-standard text-green-dark`) : (lightTheme ? ("text-green-dark") : ("text-white"))} font-black p-2 rounded cursor-pointer`}
                                                onClick={() => setContentCategory(1)}>Literature</div>
                                            <div className={`${contentCategory !== 1 ? ("bg-green-standard") : (lightTheme ? ("text-green-dark") : ("text-white"))} font-black p-2 rounded cursor-pointer`}
                                                onClick={() => setContentCategory(2)}>Art</div>
                                        </div><br />

                                        <div className={"grid grid-cols-2 gap-20 max-[900px]:grid-cols-1"}>

                                            {/* User Prompt Form */}
                                            <div className={"w-full"}>

                                                <UserPromptForm
                                                    userPrompt={userPrompt}
                                                    setUserPrompt={setUserPrompt}
                                                    contentGenerationRunning={contentGenerationRunning}
                                                    setContentGenerationRunning={setContentGenerationRunning}
                                                    generatedContent={generatedContent}
                                                    setGeneratedContent={setGeneratedContent}
                                                    contentCategory={contentCategory}
                                                    contentLookupData={contentLookupData}
                                                />

                                            </div>

                                            {/* Generated Content */}
                                            <div className={"w-full"}>
                                                <GeneratedContent
                                                    userPrompt={userPrompt}
                                                    setUserPrompt={setUserPrompt}
                                                    contentGenerationRunning={contentGenerationRunning}
                                                    setContentGenerationRunning={setContentGenerationRunning}
                                                    generatedContent={generatedContent}
                                                    setGeneratedContent={setGeneratedContent}
                                                    contentCategory={contentCategory}
                                                    contentLookupData={contentLookupData}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className={`${lightTheme ? ("text-green-dark") : ("text-white")} text-center`}>
                                Oops. There is an error on our side. Hang tight until we resolve things.
                            </p>
                        </>
                    )
                ) :
                    (
                        <>
                            <div className={"min-h-min-content-height"}></div>
                        </>
                    )
                }

                {/* Footer */}
                <div className={"sticky"}>
                    <Footer />
                </div>

            </div >
        </>
    );
}
