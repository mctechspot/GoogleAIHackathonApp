"use client"
import { RefObject, useEffect, useRef, useState } from "react"
import { CompleteUserFormType } from "@/app/types/Forms";
import { CgSpinner } from "react-icons/cg";
import { FaCopy, FaRegCopy, FaClipboard, FaClipboardCheck, FaRegClipboard } from "react-icons/fa";



export default function GeneratedContent(
    { userPrompt, setUserPrompt, contentGenerationRunning, setContentGenerationRunning,
        generatedContent, setGeneratedContent }: CompleteUserFormType) {

    const generatedContentRef: RefObject<HTMLDivElement> | null = useRef(null);
    const [contentCopied, setContentCopied] = useState<boolean>(false);

    // Function to copy generated content to clipboard
    const copyContent = (): void => {
        if (generatedContent && "response" in generatedContent) {
            setContentCopied(true);
            navigator.clipboard.writeText(generatedContent.response);

            // Change copy state for 3 seconds
            setTimeout(() => {
                setContentCopied(false);
            }, 3000);
        }
    }

    // Function to display generated content
    const displayGeneratedContent = (): void => {
        if (generatedContent && "response" in generatedContent) {
            const generatedContentRefElement = generatedContentRef?.current;
            if (generatedContentRefElement) {
                generatedContentRefElement.innerHTML = generatedContent.response;
            };
        }
    };

    useEffect(() => {
        if (generatedContent && "response" in generatedContent) {
            displayGeneratedContent();
        }
    }, [generatedContent]);

    return (
        <>
            <div className={""}>
                {!generatedContent && !contentGenerationRunning ? (
                    <>
                        <p className={"text-center"}>Your generated content will appear here.</p>
                    </>
                ) : ("")}

                {contentGenerationRunning ? (
                    <>
                        <div className={"flex justify-center items-center"}>
                            <div>
                                <p className={"text-center text-green-text font-black"}>Hang tight while we generate your content.</p><br />
                                <div className={"flex justify-center items-center text-green-standard"}>
                                    <CgSpinner className={"spin text-[100px]"} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : ("")}

                {generatedContent ? (

                    <>

                        {/* Display successful content response */}
                        {"response" in generatedContent ? (
                            <>
                                <div className={"m-2"}>
                                    <p className={"text-center text-green-text font-black"}>Here's your content!</p><br />
                                    <div className={"flex justify-end w-full cursor-pointer"}>
                                        {contentCopied ? (
                                            <>
                                                <div className={"flex items-center gap-2"}>
                                                    <p className={"text-right text-sm text-green-text font-black"}>Copied</p>
                                                    <FaClipboardCheck className={"text-right text-xl text-green-text font-black"} />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <FaRegClipboard className={"text-right text-xl text-green-text font-black"}
                                                    onClick={() => copyContent()} />
                                            </>
                                        )}
                                    </div><br />
                                    <div ref={generatedContentRef}></div>
                                </div>
                            </>
                        ) : ("")}

                        {/* Display warning response */}
                        {"warnings" in generatedContent ? (
                            <>
                                <div className={"m-2"}>
                                    <p className={"text-center text-yellow-warning font-black"}>{generatedContent.warnings.join(" ")}</p><br />
                                </div>
                            </>
                        ) : ("")}


                        {/* Display error response */}
                        {"error" in generatedContent ? (
                            <>
                                <div className={"m-2"}>
                                    <p className={"text-center text-red-error font-black"}>Error generating content. Try again.</p><br />
                                </div>
                            </>
                        ) : ("")}

                    </>
                ) : ("")}
            </div>
        </>
    );
}
