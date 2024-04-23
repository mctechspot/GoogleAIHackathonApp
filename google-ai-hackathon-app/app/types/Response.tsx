export type GeneratedContentError = {
    error: string;
}

export type GeneratedLiteratureContentSuccess = {
    response_text: string;
}

export type GeneratedArtContentSuccess = {
    response_images: string[];
}

export type GeneratedContentSuccess = {
    response: string;
}

export type GeneratedContentWarnings = {
    warnings: string[];
}

export type GeneratedArtGridType = {
    response_images: string[];
    orientation: string;
}