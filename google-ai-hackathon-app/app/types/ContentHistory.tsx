export type LiteraturePromptsType = {
    id: string;
    user_id: string;
    prompt: string;
    content_type: {
        id: string;
        content_type: string;
    }
    image_path: string | null;
    request_timestamp: string;
    response_timestamp: string;
    success: number;
    warning_or_error: number | null;
    warning_or_error_message: string | null;
}

export type LiteratureContentType = {
    id: string;
    user_id: string;
    prompt: string;
    content: string;
}

export type GeneratedLiteratureHistoryType = {
    prompt: LiteraturePromptsType;
    content: LiteratureContentType | null;
}

export type GeneratedLiteratureContentType = {
    response: {
        prompt: LiteraturePromptsType;
        content: LiteratureContentType | null;
    }
}

export type GeneratedLiteratureHistoryListType = {
    response: GeneratedLiteratureHistoryType[];
}


export type ArtPromptsType = {
    id: string;
    user_id: string;
    prompt: string;
    art_style: {
        id: string;
        style: string;
    },
    orientation: {
        id: string;
        orientation: string;
    }
    request_timestamp: string;
    response_timestamp: string;
    success: number;
    warning_or_error: number | null;
    warning_or_error_message: string | null;
}

export type ArtContentType = {
    id: string;
    user_id: string;
    prompt: string;
    image_no: number;
    image_path: string;
}

export type GeneratedArtHistoryType = {
    prompt: ArtPromptsType;
    content: ArtContentType[] | null;
}

export type GeneratedArtContentType = {
    response: {
        prompt: ArtPromptsType;
        content: ArtContentType[] | null;
    }
}

export type GeneratedArtHistoryListType = {
    response: GeneratedArtHistoryType[];
}

export type ContentHistoryError = {
    error: string;
}

