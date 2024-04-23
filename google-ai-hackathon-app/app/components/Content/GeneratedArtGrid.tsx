import Image from "next/image";
import Link from "next/link";
import { GeneratedArtContentSuccess, GeneratedArtGridType } from "@/app/types/Response"
import { FaDownload } from "react-icons/fa";

export default function GeneratedArtGrid({ response_images, orientation }: GeneratedArtGridType) {

    
    return (
        <>
            <div className={"grid grid-col-1 gap-10"}>
                {response_images.map((contentSrc: any, index: number) => {
                    return (
                        <>
                            <div className={"relative"}>
                                <div key={`generated-image-container-${index + 1}`}
                                    className={`relative block m-auto h-[300px] w-full rounded`}>
                                    <Image
                                        src={`data:image/png;base64,${contentSrc}`}
                                        alt={`Generated Image ${index + 1}`}
                                        height={"300"}
                                        width={"300"}
                                        className={"block m-auto h-full w-full object-fit rounded"}
                                        key={`genrated-image-${index + 1}`}
                                    />
                                </div>
                                <div key={`genrated-image-download-icon-container-${index + 1}`}
                                    className={"absolute bottom-0 right-0 m-5 \
                                    bg-green-standard text-black rounded cursor-pointer w-fit p-2"}>
                                    <FaDownload
                                        key={`genrated-image-download-icon-${index + 1}`}
                                    />
                                </div>
                            </div>
                        </>
                    );
                })}
            </div >
        </>
    );
}
