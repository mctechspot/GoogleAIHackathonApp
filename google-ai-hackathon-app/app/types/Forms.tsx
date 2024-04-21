import { SetStateAction } from "react";

export type UserFormProps = {
    prompt: string;
    image?: any;
    contentType: string;
}

export type UserFormType = {
    userPrompt: UserFormProps;
    setUserPrompt: React.Dispatch<SetStateAction<UserFormProps>>;
}

export type ContentDropdownProps = {
    key: string;
    value: string;
}