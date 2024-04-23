import { SetStateAction } from "react";
import { 
    GeneratedContentError, 
    GeneratedLiteratureContentSuccess, 
    GeneratedArtContentSuccess, 
    GeneratedContentWarnings 
} from "@/app/types/Response";

export type UserFormProps = {
    prompt: string;
    image?: File | null;
    content_type: string;
    orientation: string;
}

export type ContentDropdownProps = {
    key: string;
    value: string;
}

export type UserFormType = {
    userPrompt: UserFormProps;
    setUserPrompt: React.Dispatch<SetStateAction<UserFormProps>>;
    contentCategory: number;
}

export type CompleteUserFormType = {
    userPrompt: UserFormProps;
    setUserPrompt: React.Dispatch<SetStateAction<UserFormProps>>;
    contentGenerationRunning:boolean;
    setContentGenerationRunning: React.Dispatch<SetStateAction<boolean>>;
    generatedContent: GeneratedContentError | GeneratedLiteratureContentSuccess | GeneratedArtContentSuccess | GeneratedContentWarnings | null;
    setGeneratedContent: React.Dispatch<SetStateAction<GeneratedContentError | GeneratedLiteratureContentSuccess | GeneratedArtContentSuccess | GeneratedContentWarnings | null>>;
    contentCategory: number;
}