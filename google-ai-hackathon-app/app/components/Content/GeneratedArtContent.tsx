"use client"
import Image from "next/image"
import Link from "next/link"
import { RefObject, useContext, useEffect, useRef, useState } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import { GeneratedArtContentType, ArtContentType } from "@/app/types/ContentHistory"
import { IoIosWarning } from "react-icons/io";
import { MdError } from "react-icons/md";
import { formatDateWithTime } from "@/app/utils/Dates"

export default function GeneratedArtContent(response: GeneratedArtContentType) {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    //const contentRef: RefObject<HTMLDivElement> | null = useRef(null);

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
                        <p className={`${lightTheme ? ("text-black") : ("text-white")} text-center font-black`}>
                            <Link href={"/my-content"}>My Content</Link>&nbsp;&gt;&nbsp;
                            Generated Art
                        </p><br />

                        <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                            <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Prompt &nbsp; &nbsp;</span>
                            {response.response.prompt.prompt}
                        </p>

                        <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                            <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Art Style &nbsp; &nbsp;</span>
                            {response.response.prompt.art_style.style}
                        </p>

                        <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                            <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Orientation &nbsp; &nbsp;</span>
                            {response.response.prompt.orientation.orientation}
                        </p>

                        <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                            <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Requested at &nbsp; &nbsp;</span>
                            {formatDateWithTime(response.response.prompt.request_timestamp)}
                        </p>

                        <p className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                            <span className={`${lightTheme ? ("") : ("")} text-green-text font-black`}>Received at &nbsp; &nbsp;</span>
                            {formatDateWithTime(response.response.prompt.response_timestamp)}
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
                                {response.response.content ? (
                                    <>
                                        <p className={`text-green-text font-black`}>Content &nbsp; &nbsp;</p>
                                        <div className={`grid grid-cols-3 gap-2 w-full max-[900px]:grid-cols-1`}>
                                            {response.response.content.map((content: ArtContentType, index: number) => {
                                                return (
                                                    <>
                                                        <div className={`relative`}>
                                                            <Image
                                                                src={content.image_path}
                                                                alt={`Image Prompt`}
                                                                height={"200"}
                                                                width={"200"}
                                                                className={`bg-green-standard rounded w-full`}
                                                            />
                                                        </div>
                                                    </>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : ("")}
                            </>
                        )
                        }
                    </>
                )}
            </div>
        </>
    );
}