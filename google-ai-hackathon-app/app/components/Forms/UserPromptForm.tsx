import Link from "next/link";
import { ContentDropdownProps, UserFormProps, UserFormType } from "@/app/types/Forms"
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function UserPromptForm({userPrompt, setUserPrompt}: UserFormType) {

    const handleUserPromptSubmit = (event: any): void => {
        event.preventDefault();
    };

    return (
        <>
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
        </>
    );
}
