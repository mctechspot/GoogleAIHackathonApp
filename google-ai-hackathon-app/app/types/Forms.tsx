import { SetStateAction } from "react";
import { GeneratedContentError, GeneratedContentSuccess, GeneratedContentWarnings } from "@/app/types/Response";

export type UserFormProps = {
    prompt: string;
    image?: any;
    content_type: string;
}

export type UserFormType = {
    userPrompt: UserFormProps;
    setUserPrompt: React.Dispatch<SetStateAction<UserFormProps>>;
}

export type ContentDropdownProps = {
    key: string;
    value: string;
}

export type CompleteUserFormType = {
    userPrompt: UserFormProps;
    setUserPrompt: React.Dispatch<SetStateAction<UserFormProps>>;
    contentGenerationRunning:boolean;
    setContentGenerationRunning: React.Dispatch<SetStateAction<boolean>>;
    generatedContent: GeneratedContentError |GeneratedContentSuccess | GeneratedContentWarnings | null;
    setGeneratedContent: React.Dispatch<SetStateAction<GeneratedContentError |GeneratedContentSuccess | GeneratedContentWarnings | null>>;
}