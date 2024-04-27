import { ContentDropdownProps } from "@/app/types/Forms"

export type ContentLookupDataProps = {
    literature_content_types: ContentDropdownProps[];
    art_styles: ContentDropdownProps[];
    image_orientations: ContentDropdownProps[];
}

export type ContentLookupDataType = {
    contentLookupData: ContentLookupDataProps;
}

export type ContentLookupDataError = {
    error: string;
}