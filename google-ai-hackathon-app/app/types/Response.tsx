export type GeneratedContentError = {
    error: string;
}

export type GeneratedContentInputError = {
    input_error: string;
}

export type GeneratedLiteratureContentSuccess = {
    response_text: string;
    timestamp: number;
}

export type GeneratedArtContentSuccess = {
    response_images: string[];
    timestamp: number;
}

export type GeneratedContentSuccess = {
    response: string;
    timestamp: number;
}

export type GeneratedContentWarnings = {
    warnings: string[];
    timestamp: number;
}

export type GeneratedArtGridType = {
    response_images: string[];
    orientation: string;
    timestamp: number;
}