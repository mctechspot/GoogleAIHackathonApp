"use client"
import { SetStateAction, useEffect, useState } from "react"
import Image from "next/image";
import Link from "next/link";
import ContentTypeDropdown from "@/app/components/Dropdown/ContentTypeDropdown";
import { ContentDropdownProps, UserFormProps, UserFormType, CompleteUserFormType } from "@/app/types/Forms"
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function UserPromptForm(
    { userPrompt, setUserPrompt, contentGenerationRunning, setContentGenerationRunning,
        generatedContent, setGeneratedContent }: CompleteUserFormType) {

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

    const handleUserPromptSubmit = async (event: any): Promise<void> => {
        event.preventDefault();
        setGeneratedContent(null);
        setContentGenerationRunning(false);

        let payload;
        let apiEndpoint: string = "";

        if (userPrompt.image) {
            // Handle case where image is included in prompt
            payload = new FormData(event.target);
            payload.append("image", userPrompt.image);
            payload.append("content_type", userPrompt.content_type);
            payload.append("prompt", userPrompt.prompt);
            apiEndpoint = "/api/generate-text-from-prompt-and-image";
        } else {
            // Handle case where no image is included in prompt
            payload = JSON.stringify(userPrompt);
            apiEndpoint = "/api/generate-text-from-prompt";
        }

        setContentGenerationRunning(true);
        const contentRes: Response = await fetch(apiEndpoint, {
            "body": payload,
            "method": "POST"
        });

        const contentJson = await contentRes.json();
        console.log(contentJson);
        setContentGenerationRunning(false);
        setGeneratedContent(contentJson);
    }

    return (
        <>
            <form id={"prompt-form"} className={"prompt-form"} onSubmit={(event) => handleUserPromptSubmit(event)}>

                <p className={"text-center text-green-text font-black"}>Enter a prompt to get your content.</p><br />

                {/* Content Type Generator */}
                <ContentTypeDropdown
                    userPrompt={userPrompt}
                    setUserPrompt={setUserPrompt}
                /><br />

                <textarea
                    id={"prompt-text"} name={"prompt-text"}
                    placeholder={"Give a topic for your content, e.g. island dreams."}
                    className={"border grey-pale rounded min-w-full min-h-[200px]\
                                            outline-green-standard resize-y p-5"}
                    value={userPrompt.prompt}
                    onChange={(event) => setUserPrompt({ ...userPrompt, prompt: event.target.value })}
                >
                </textarea><br /><br />

                <div className={"border-2 border-solid border-dashed border-green-standard rounded p-5"}>
                    <p className={"text-center text-green-text font-black"}>Add an image for context (optional).</p><br />

                    <input type={"file"} id={"prompt-image"} name={"prompt-image"}
                        accept={"image/jpeg, image/jpg, image/png"}
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



                <div className={"flex gap-2 w-full"}>
                    <button type={"submit"} className={"bg-green-standard rounded p-2 w-full disabled:bg-green-disabled"}
                    disabled={contentGenerationRunning}>Generate</button>
                    <button type={"button"} className={"bg-green-standard rounded p-2 w-full"}
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
