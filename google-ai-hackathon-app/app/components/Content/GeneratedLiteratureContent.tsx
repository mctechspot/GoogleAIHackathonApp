"use client"
import Image from "next/image"
import Link from "next/link"
import { RefObject, useContext, useEffect, useRef, useState } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import { GeneratedLiteratureContentType } from "@/app/types/ContentHistory"
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import { formatDateWithTime } from "@/app/utils/Dates"

export default function GeneratedLiteratureContent(response: GeneratedLiteratureContentType) {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const contentRef: RefObject<HTMLDivElement> | null = useRef(null);

    const formatLiteratureContentPreview = (content: string) => {
        const contentElement = contentRef?.current;
        if (contentElement) {
            let formattedContent: string = content;
            if (content.trim() !== "") {
                // Format content for html
                // Replace "\n" line breaks with <br> tags
                formattedContent = content.replaceAll(/\n/g, "<br>");

                // Replace ** content ** to reflect <b>content</b> format
                formattedContent = formattedContent.replaceAll(/\*\*(.*?)\*\*/g, "<b>$1</b>");
            }
            contentElement.innerHTML = formattedContent;
        }
    }

    useEffect(() => {
        if (response.response.content) {
            formatLiteratureContentPreview(response.response.content.content);
        }
    }, [])

    return (
        <>
            <div className={`grid grid-cols-1 gap-4`}>

                {!response.response.prompt ? (
                    <>
                        <p className={`${lightTheme ? ("text-black") : ("text-white")} text-center`}>
                            No prompt found with this ID.
                        </p>
                    </>
                ) : (
                    <>
                        <p className={`${lightTheme ? ("text-black") : ("text-white")} text-center font-black`}>Generated Literature</p><br />

                        <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                            <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Prompt &nbsp; &nbsp;</span>
                            {response.response.prompt.prompt}
                        </p>

                        {response.response.prompt.image_path ? (
                            <>
                                <div className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                    <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Image &nbsp; &nbsp;</span><br />
                                    <div className={`relative`}>
                                        <Image
                                            src={response.response.prompt.image_path}
                                            alt={`Image Prompt`}
                                            height={"200"}
                                            width={"200"}
                                            className={`bg-green-standard rounded`}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : ("")}


                        <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                            <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Requested at &nbsp; &nbsp;</span>
                            {formatDateWithTime(response.response.prompt.request_timestamp)}
                        </p>

                        <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                            <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Received at &nbsp; &nbsp;</span>
                            {formatDateWithTime(response.response.prompt.response_timestamp)}
                        </p>

                        <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                            <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Content Type &nbsp; &nbsp;</span>
                            {response.response.prompt.content_type.content_type}
                        </p>

                        {response.response.prompt.warning_or_error ? (
                            response.response.prompt.warning_or_error === 1 ? (
                                <>
                                    <div className={`flex items-center gap-2 \
                                                        ${lightTheme ? ("text-yellow-warning") : ("text-yellow-warning-pale")} font-black`}>
                                        <div><IoIosWarning /></div>
                                        <p>
                                            {response.response.prompt.warning_or_error_message}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={`flex items-center gap-2 \
                                                        ${lightTheme ? ("text-red-error") : ("text-red-error-medium")} font-black`}>
                                        <div><MdError /></div>
                                        <p>
                                            Error generating content.
                                        </p>
                                    </div>
                                </>
                            )
                        ) : (
                            <>
                                <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                    <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Content</span><br /><br />
                                    {response.response.content ? (
                                        <>
                                            <div ref={contentRef}></div>
                                        </>
                                    ) : ("")}
                                </p>
                            </>
                        )
                        }
                    </>
                )}
            </div>
        </>
    );
}