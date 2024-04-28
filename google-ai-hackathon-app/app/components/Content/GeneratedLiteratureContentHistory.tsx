"use client"
import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import { GeneratedLiteratureHistoryListType, GeneratedLiteratureHistoryType } from "@/app/types/ContentHistory"
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import { formatDateWithTime } from "@/app/utils/Dates"

export default function GeneratedLiteratureContentHistory({response}: GeneratedLiteratureHistoryListType) {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);

    const formatLiteratureContentPreview = (content: string): string => {
        let formattedContent: string = content;
        if (content.trim() !== "") {
            // Format content for html
            // Replace "\n" line breaks with <br> tags
            formattedContent = content.replaceAll(/\n/g, "\n");

            // Replace ** content ** to reflect <b>content</b> format
            formattedContent = formattedContent.replaceAll(/\*\*(.*?)\*\*/g, "$1:");
        }

        return formattedContent.substring(0, 200) + "...";
    }

    return (
        <>
            <div className={`grid grid-cols-1 gap-4`}>
                {response.length === 0 ? (
                    <>
                        <p className={`${lightTheme ? ("text-black") : ("text-white")} text-center`}>
                            You have not generated any literature content yet. &nbsp;
                            <Link className={`text-green-text font-black`} href={"/generate"} target={"_blank"}>
                                Try now!
                            </Link>
                        </p>
                    </>
                ) :
                    (
                        <>
                            {response.map((generatedContent: GeneratedLiteratureHistoryType, index: number) => {
                                return (
                                    <>
                                        <Link key={index + 1}href={`/my-content/literature/${generatedContent.prompt.id}`}
                                            className={`border border-solid ${lightTheme ? ("border-green-text") : ("border-green-pale")} rounded p-5`}>

                                            <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                                <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Prompt &nbsp; &nbsp;</span>
                                                {generatedContent.prompt.prompt}
                                            </p>

                                            {generatedContent.prompt.image_path ? (
                                                <>
                                                    <div className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                                        <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Image &nbsp; &nbsp;</span>
                                                        <Image
                                                            src={generatedContent.prompt.image_path}
                                                            alt={`Image Prompt`}
                                                            height={"200"}
                                                            width={"200"}
                                                        />
                                                    </div>
                                                </>
                                            ) : ("")}


                                            <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                                <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Requested at &nbsp; &nbsp;</span>
                                                {formatDateWithTime(generatedContent.prompt.request_timestamp)}
                                            </p>

                                            <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                                <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Received at &nbsp; &nbsp;</span>
                                                {formatDateWithTime(generatedContent.prompt.response_timestamp)}
                                            </p>

                                            <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                                <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Content Type &nbsp; &nbsp;</span>
                                                {generatedContent.prompt.content_type.content_type}
                                            </p>

                                            {generatedContent.prompt.warning_or_error ? (
                                                generatedContent.prompt.warning_or_error === 1 ? (
                                                    <>
                                                        <div className={`flex items-center gap-2 \
                                                        ${lightTheme ? ("text-yellow-warning") : ("text-yellow-warning-pale")} font-black`}>
                                                            <div><IoIosWarning /></div>
                                                            <p>
                                                                {generatedContent.prompt.warning_or_error_message}
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
                                                        <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Content &nbsp; &nbsp;</span>
                                                        {generatedContent.content ? (
                                                            <>
                                                                {formatLiteratureContentPreview(generatedContent.content?.content)}
                                                            </>
                                                        ) : ("")}
                                                    </p>
                                                </>
                                            )
                                            }
                                        </Link>
                                    </>
                                );
                            })}
                        </>
                    )}

            </div>
        </>
    );
}