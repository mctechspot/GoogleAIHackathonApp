"use client"
import ReactDOMServer from 'react-dom/server';
import { RefObject, useContext, useEffect, useRef, useState } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout"
import { CompleteUserFormType } from "@/app/types/Forms";
import { CgSpinner } from "react-icons/cg";
import { FaClipboardCheck, FaRegClipboard } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import GeneratedArtGrid from "@/app/components/Content/GeneratedArtGrid"

export default function GeneratedContent(
    { userPrompt, setUserPrompt, contentGenerationRunning, setContentGenerationRunning,
        generatedContent, setGeneratedContent, contentCategory }: CompleteUserFormType) {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const generatedContentContainer: RefObject<HTMLDivElement> | null = useRef(null);
    const generatedContentRef: RefObject<HTMLDivElement> | null = useRef(null);
    const [contentCopied, setContentCopied] = useState<boolean>(false);

    // Function to copy generated content to clipboard
    const copyContent = (): void => {
        if (generatedContent && "response_text" in generatedContent) {
            setContentCopied(true);
            if ("response_text" in generatedContent) {
                navigator.clipboard.writeText(generatedContent.response_text);
            }

            // Change copy state for 2 seconds
            setTimeout(() => {
                setContentCopied(false);
            }, 2000);
        }
    }

    // Function to display generated content
    const displayGeneratedContent = (): void => {
        if (generatedContent && ("response_text" in generatedContent || "response_images" in generatedContent)) {
            const generatedContentElement = generatedContentRef?.current;
            if (generatedContentElement) {

                // Display content for literature
                if (contentCategory === 1) {
                    if ("response_text" in generatedContent) {

                        let formattedContent: string = `<p className={"text-center"}>Erm... we are having trouble generating an image for this prompt. Why don't you try another one?</p>`;
                        if (generatedContent.response_text.trim() !== "") {
                            // Format content for html
                            // Replace "\n" line breaks with <br> tags
                            formattedContent = generatedContent.response_text.replaceAll(/\n/g, "<br>");

                            // Replace ** content ** to reflect <b>content</b> format
                            formattedContent = formattedContent.replaceAll(/\*\*(.*?)\*\*/g, "<b>$1</b>");
                        }

                        generatedContentElement.innerHTML = formattedContent;
                    }

                } else { // Display content for art
                    if ("response_images" in generatedContent) {
                        const jsxContent = <GeneratedArtGrid
                            response_images={generatedContent.response_images}
                            orientation={userPrompt.orientation} />;
                        const htmlString = ReactDOMServer.renderToString(jsxContent);
                        generatedContentElement.innerHTML = htmlString;
                    }

                }
            };
        }
    };

    // Display content once it is successfully generated
    useEffect(() => {
        if (generatedContent && ("response_text" in generatedContent || "response_images" in generatedContent)) {
            displayGeneratedContent();
        }
    }, [generatedContent]);

    // Scroll content generation loader into view once endpoint is running
    useEffect(() => {
        if (contentGenerationRunning) {
            const generatedContentContainerElement = generatedContentContainer?.current;
            if (generatedContentContainerElement) {
                generatedContentContainerElement.scrollIntoView({ behavior: "smooth" });
            };
        }
    }, [contentGenerationRunning]);

    return (
        <>
            <div className={""} ref={generatedContentContainer}>
                {!generatedContent && !contentGenerationRunning ? (
                    <>
                        <p className={"text-center text-green-text font-black"}>Your generated content will appear here.</p>
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
                        {"response_text" in generatedContent || "response_images" in generatedContent ? (
                            <>
                                <div className={"m-2"} >
                                    {"response_text" in generatedContent && generatedContent.response_text === "" ||
                                        "response_images" in generatedContent && generatedContent.response_images.length === 0 ? (
                                        <>
                                            <p className={"text-center text-green-text font-black"}>Well... this is awkward.</p><br />
                                        </>
                                    ) : (
                                        <>
                                            <p className={"text-center text-green-text font-black"}>Here&apos;s your content!</p><br />
                                        </>
                                    )}
                                    <div>
                                        {contentCategory === 1 ? (
                                            <>
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
                                            </>
                                        ) : ("")}

                                        <div ref={generatedContentRef}
                                            className={`${lightTheme ? ("text-black") : ("text-white")}`}></div>
                                    </div>
                                </div>
                            </>
                        ) : ("")}

                        {/* Display warning response */}
                        {"warnings" in generatedContent ? (
                            <>
                                <div className={"m-2"}>
                                    <div className={"flex justify-center text-center text-[50px] text-yellow-warning font-black"}>
                                        <IoIosWarning />
                                    </div><br />
                                    <p className={`text-center text-yellow-warning font-black`}>{generatedContent.warnings.join(" ")}</p><br />
                                </div>
                            </>
                        ) : ("")}


                        {/* Display error response */}
                        {"error" in generatedContent ? (
                            <>
                                <div className={"m-2"}>
                                    <div className={`flex justify-center text-center text-[50px] ${lightTheme ? ("text-red-error") : ("text-red-error-medium")} font-black`}>
                                        <MdError />
                                    </div><br />
                                    <p className={`text-center ${lightTheme ? ("text-red-error") : ("text-red-error-medium")} font-black`}>Error generating content. Try again.</p><br />
                                </div>
                            </>
                        ) : ("")}

                    </>
                ) : ("")}
            </div>
        </>
    );
}