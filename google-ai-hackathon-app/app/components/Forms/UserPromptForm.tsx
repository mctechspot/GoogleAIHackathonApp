"use client"
import { SetStateAction, useContext, useEffect, useState } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout"
import Image from "next/image";
import ContentTypeDropdown from "@/app/components/Dropdown/ContentTypeDropdown";
import { CompleteUserFormType } from "@/app/types/Forms"
import { ContentLookupDataType, ContentLookupDataError } from "@/app/types/ContentLookupData"
import {
    TbRectangle,
    TbRectangleFilled,
    TbRectangleVertical,
    TbRectangleVerticalFilled,
    TbSquare,
    TbSquareFilled
} from "react-icons/tb";


export default function UserPromptForm(
    { userPrompt, setUserPrompt, contentGenerationRunning, setContentGenerationRunning,
        generatedContent, setGeneratedContent, contentCategory, contentLookupData }: CompleteUserFormType) {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const [imagePreviewSrc, setImagePreviewSrc] = useState<string>("");

    // Function to preview image
    const previewImage = (event: any, setImagePreviewSrc: React.Dispatch<SetStateAction<string>>) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.addEventListener('load', function () {
            setImagePreviewSrc(reader.result as string);
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    // Function to content generation api endpoint call
    const handleUserPromptSubmit = async (event: any): Promise<void> => {
        event.preventDefault();
        setGeneratedContent(null);
        setContentGenerationRunning(false);

        // Set payload and appropriate endpoint based on content category and user input prompts
        let payload;
        let apiEndpoint: string = "";


        // Literature Content
        if (contentCategory === 1) {
            if (userPrompt.image) {
                // Handle case where image is included in prompt
                payload = new FormData(event.target);
                payload.append("image", userPrompt.image);
                payload.append("content_type", userPrompt.content_type);
                payload.append("prompt", userPrompt.prompt);
                apiEndpoint = "/api/generate-text-from-prompt-and-image";
            } else {
                // Handle case where no image is included in prompt
                payload = payload = JSON.stringify({
                    "prompt": userPrompt.prompt,
                    "content_type": userPrompt.content_type,
                });
                apiEndpoint = "/api/generate-text-from-prompt";
            }
        } // Art Content
        else {
            payload = JSON.stringify({
                "prompt": userPrompt.prompt,
                "style": userPrompt.content_type,
                "orientation": userPrompt.orientation
            });
            apiEndpoint = "/api/generate-image-from-text";
        }

        setContentGenerationRunning(true);
        const contentRes: Response = await fetch(apiEndpoint, {
            "body": payload,
            "method": "POST"
        });

        const contentJson = await contentRes.json();
        if ("response" in contentJson) {
            if (contentCategory === 1) {
                setGeneratedContent({ "response_text": contentJson.response, "timestamp": contentJson.timestamp });
            } else {
                setGeneratedContent({ "response_images": contentJson.response, "timestamp": contentJson.timestamp });
            }
        } else {
            setGeneratedContent(contentJson);
        }
        setContentGenerationRunning(false);
    }

    return (
        <>
            <form id={"prompt-form"} className={"prompt-form"} onSubmit={(event) => handleUserPromptSubmit(event)}>

                <p className={"text-center text-green-text font-black"}>
                    Enter a prompt to get your content.
                </p><br />

                <div className={"grid grid-cols-2 gap-5 max-[900px]:grid-cols-1"}>
                    {/* Content Type Generator */}
                    <ContentTypeDropdown
                        userPrompt={userPrompt}
                        setUserPrompt={setUserPrompt}
                        contentCategory={contentCategory}
                        contentLookupData={contentLookupData}
                    />
                    {contentCategory !== 1 ? (
                        <>
                            <div className={"flex items-center gap-2"}>
                                <p className={`${lightTheme ? ("text-green-dark") : ("text-white")}`}>Orientation </p>

                                <div className={"flex items-center gap-2"}>
                                    <div className={`text-2xl cursor-pointer \
                                    ${userPrompt.orientation === "1" ? ("text-green-text font-black") : (`${lightTheme ? ("text-green-text") : ("text-white")}`)}`}
                                        onClick={() => setUserPrompt({ ...userPrompt, orientation: contentLookupData.image_orientations[0].key })}>
                                        {userPrompt.orientation === contentLookupData.image_orientations[0].key ? (<TbSquareFilled />) : (<TbSquare />)}
                                    </div>
                                    <div className={`text-2xl cursor-pointer \
                                    ${userPrompt.orientation === "2" ? ("text-green-text font-black") : (`${lightTheme ? ("text-green-text") : ("text-white")}`)}`}
                                        onClick={() => setUserPrompt({ ...userPrompt, orientation: contentLookupData.image_orientations[1].key })}>
                                        {userPrompt.orientation === contentLookupData.image_orientations[1].key ? (<TbRectangleVerticalFilled />) : (<TbRectangleVertical />)}
                                    </div>

                                    <div className={`text-2xl cursor-pointer \
                                    ${userPrompt.orientation === "3" ? ("text-green-text font-black") : (`${lightTheme ? ("text-green-text") : ("text-white")}`)}`}
                                        onClick={() => setUserPrompt({ ...userPrompt, orientation: contentLookupData.image_orientations[2].key })}>
                                        {userPrompt.orientation === contentLookupData.image_orientations[2].key ? (<TbRectangleFilled />) : (<TbRectangle />)}
                                    </div>
                                </div>
                            </div>

                        </>
                    ) : ("")}
                </div>
                <br />

                <textarea
                    id={"prompt-text"} name={"prompt-text"}
                    placeholder={"Give a short prompt topic with key terms comma separated, e.g. grey cat, night time. Maximum 300 characters."}
                    className={`border ${lightTheme ? ("bg-white border-grey-pale text-black") : ("bg-green-dark border-green-standard text-white")} \
                     rounded min-w-full min-h-[150px] outline-green-standard resize-y p-5`}
                    maxLength={300}
                    value={userPrompt.prompt}
                    onChange={(event) => setUserPrompt({ ...userPrompt, prompt: event.target.value })}>
                </textarea><br /><br />

                {contentCategory === 1 ? (
                    <>
                        <div className={"border-2 border-solid border-dashed border-green-standard rounded p-5"}>
                            <p className={"text-center text-green-text font-black"}>Add an image for context (optional).</p><br />

                            {/* Image  Input */}
                            <input type={"file"} id={"prompt-image"} name={"prompt-image"}
                                accept={"image/jpeg, image/jpg, image/png"}
                                className={`${lightTheme ? ("text-black") : ("text-white")}`}
                                onChange={(event) => {
                                    {
                                        setUserPrompt({ ...userPrompt, image: event.target.files?.[0] });
                                        previewImage(event, setImagePreviewSrc);
                                    }
                                }} /><br /><br />

                            {/* Image  Preview*/}
                            {imagePreviewSrc ? (
                                <>
                                    <Image
                                        src={imagePreviewSrc}
                                        alt={'Image Preview'}
                                        height={"200"}
                                        width={"200"}
                                        className={`block m-auto h-auto w-[200px]`}
                                        style={{ display: imagePreviewSrc === "" ? "none" : "block" }}
                                    />
                                </>
                            ) : ("")}


                        </div><br />
                    </>

                ) : ("")}



                <div className={"flex gap-2 w-full"}>
                    <button type={"submit"} className={"bg-green-standard rounded p-2 w-full text-green-dark font-black disabled:bg-green-disabled"}
                        disabled={contentGenerationRunning}>Generate</button>
                    <button type={"button"} className={"bg-green-standard rounded text-green-dark font-black p-2 w-full"}
                        onClick={() => {
                            setUserPrompt({ ...userPrompt, prompt: "", image: null });
                            setImagePreviewSrc("");
                        }}>
                        Clear
                    </button>
                </div>

            </form>
        </>
    );
}
