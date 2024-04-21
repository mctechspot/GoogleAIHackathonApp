"use client"
import { useEffect, useState } from "react"
import Image from "next/image";
import Link from "next/link";
import ContentTypeDropdown from "@/app/components/Dropdown/ContentTypeGenerator"
import Header from "@/app/components/Navigation/Header";
import Footer from "@/app/components/Navigation/Footer";
import { UserFormProps, UserFormType } from "@/app/types/Forms"

export default function GenerateScreen() {

    const [userPrompt, setUserPrompt] = useState<UserFormProps>({
        "prompt": "",
        "image": null,
        "contentType": "1"
    });

    const handleUserPromptSubmit = (event: any): void => {
        event.preventDefault();
    };

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

                                    <form id={"prompt-form"} className={"prompt-form"} onSubmit={(event) => handleUserPromptSubmit(event)}>
                                        <textarea
                                            placeholder={"Give a topic for your content, e.g. island dreams."}
                                            className={"border grey-pale rounded min-w-full min-h-[300px]\
                                            outline-green-standard resize-y p-5"}
                                            value={userPrompt.prompt}
                                            onChange={(event) => setUserPrompt({ ...userPrompt, prompt: event.target.value })}
                                        >
                                        </textarea><br /><br />

                                        <div className={"flex gap-2 w-full"}>
                                            <button type={"submit"} className={"bg-green-standard rounded p-2 w-full"}>Generate</button>
                                            <button type={"button"} className={"bg-green-standard rounded p-2 w-full"}
                                                onClick={() => setUserPrompt({ ...userPrompt, prompt: "" })}>
                                                Clear
                                            </button>
                                        </div>

                                    </form>
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
