"use client"
import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import { GeneratedArtHistoryType, ArtContentType, GeneratedArtHistoryListType } from "@/app/types/ContentHistory"
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import { formatDateWithTime } from "@/app/utils/Dates"

export default function GeneratedArtContentHistory({ response }: GeneratedArtHistoryListType) {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);

    return (
        <>
            <div className={`grid grid-cols-1 gap-4`}>
                {response.length === 0 ? (
                    <>
                        <p className={`${lightTheme ? ("text-black") : ("text-white")} text-center`}>
                            You have not generated any art content yet. &nbsp;
                            <Link className={`text-green-text font-black`} href={"/generate"} target={"_blank"}>
                                Try now!
                            </Link>
                        </p>
                    </>
                ) :
                    (
                        <>
                            {response.map((generatedContent: GeneratedArtHistoryType, index: number) => {
                                return (
                                    <>
                                        <Link key={index + 1} href={`/my-content/art/${generatedContent.prompt.id}`}
                                            className={`border border-solid ${lightTheme ? ("border-green-text") : ("border-green-pale")} rounded p-5`}>

                                            <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                                <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Prompt &nbsp; &nbsp;</span>
                                                {generatedContent.prompt.prompt}
                                            </p>

                                            <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                                <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Requested at &nbsp; &nbsp;</span>
                                                {formatDateWithTime(generatedContent.prompt.request_timestamp)}
                                            </p>

                                            <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                                <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Received at &nbsp; &nbsp;</span>
                                                {formatDateWithTime(generatedContent.prompt.response_timestamp)}
                                            </p>

                                            <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                                <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Art Style &nbsp; &nbsp;</span>
                                                {generatedContent.prompt.art_style.style}
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
                                                    {generatedContent.content ? (
                                                        <>
                                                            <p className={`text-green-text font-black`}>Content &nbsp; &nbsp;</p><br />
                                                            <div className={`grid grid-cols-3 gap-2 w-fit`}>
                                                                {generatedContent.content?.map((content: ArtContentType, index: number) => {
                                                                    return (
                                                                        <>
                                                                            <div className={`relative`}>
                                                                                <Image
                                                                                    src={content.image_path}
                                                                                    alt={`Image Prompt`}
                                                                                    height={"200"}
                                                                                    width={"200"}
                                                                                    className={`bg-green-standard rounded`}
                                                                                />
                                                                            </div>
                                                                        </>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    ) : ("")}
                                                </>
                                            )}
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