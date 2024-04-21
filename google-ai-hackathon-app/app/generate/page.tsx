"use client"
import { useEffect, useState } from "react"
import Image from "next/image";
import Link from "next/link";
import ContentTypeDropdown from "@/app/components/Dropdown/ContentTypeDropdown";
import Header from "@/app/components/Navigation/Header";
import Footer from "@/app/components/Navigation/Footer";
import UserPromptForm from "@/app/components/Forms/UserPromptForm";
import { UserFormProps, UserFormType } from "@/app/types/Forms";

export default function GenerateScreen() {

    const [userPrompt, setUserPrompt] = useState<UserFormProps>({
        "prompt": "",
        "image": null,
        "contentType": "1"
    });

    return (
        <>
            <div className={`page-container`}>

                {/* Header */}
                <div>
                    <Header />
                </div>

                <div>

                    <div>


                        <div className={"mx-20 my-5"}>
                            <div className={"grid grid-cols-2 gap-2"}>

                                {/* User Prompt Form */}
                                <div className={"w-full"}>

                                    <p>Enter a prompt. Get your content.</p><br />

                                    {/* Content Type Generator */}
                                    <ContentTypeDropdown 
                                    userPrompt={userPrompt}
                                    setUserPrompt={setUserPrompt}
                                    /><br />

                                    <UserPromptForm
                                    userPrompt={userPrompt}
                                    setUserPrompt={setUserPrompt}
                                    />

                                    
                                </div>

                                {/* Generated Content */}
                                <div className={"w-full"}>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className={"sticky"}>
                    <Footer />
                </div>

            </div >
        </>
    );
}
