"use client"
import { RefObject, useContext, useEffect, useRef, useState } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout"
import Image from "next/image";
import Link from "next/link";
import { GeneratedArtContentSuccess, GeneratedArtGridType } from "@/app/types/Response"
import { FaDownload } from "react-icons/fa";

export default function GeneratedArtGrid({ response_images, orientation }: GeneratedArtGridType) {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const [downloadImagesRunning, setDownloadImagesRunning] = useState<boolean>(false);
    const [downloadImagesError, setDownloadImagesError] = useState<string>("");

    const image1Ref: RefObject<HTMLImageElement> | null = useRef(null);
    const image2Ref: RefObject<HTMLImageElement> | null = useRef(null);
    const image3Ref: RefObject<HTMLImageElement> | null = useRef(null);


    // Download images
    const downloadImage = async (imageSrc: string, fileName: string): Promise<void> => {
        console.log("download image");
    }

    // Trigger image download function
    const triggerImagesDownload = async (imageToDownload: string): Promise<void> => {
        setDownloadImagesError("");
        setDownloadImagesRunning(true);
        const image1 = image1Ref.current ? image1Ref.current.src : null;
        const image2 = image2Ref.current ? image2Ref.current.src : null;
        const image3 = image3Ref.current ? image3Ref.current.src : null;

        const validImages: any = [image1, image2, image3].filter((image: string | null, index: number) => image);
        console.log(validImages);
        let optimisedImageUrls: string[] = [];
        if (imageToDownload === "all") {
            optimisedImageUrls = validImages;
        }
        if (imageToDownload === "1" && image1) {
            optimisedImageUrls = [image1];
        }
        if (imageToDownload === "2" && image2) {
            optimisedImageUrls = [image2];
        }
        if (imageToDownload === "3" && image3) {
            optimisedImageUrls = [image3];
        }
        optimisedImageUrls.forEach(async (url: string, index: number) => {
            if (imageToDownload === "all") {
                await downloadImage(url, `jenna_image_${index + 1}`);
            } else {
                await downloadImage(url, `jenna_image_${imageToDownload}`);
            }
        });
        setDownloadImagesRunning(false);
    }



    return (
        <>
            <div className={"grid grid-col-1 gap-10"}>
                {response_images.length === 0 ? (
                    <>
                        <p className={`text-center ${lightTheme ? ("text-black"):("text-white")}`}>Erm... we are having trouble generating an image for this prompt.
                            Why don&apos;t you try another one?
                        </p>
                    </>
                ) : (
                    <>
                        {response_images.map((contentSrc: any, index: number) => {
                            return (
                                <>
                                    <div className={"relative"}>
                                        <div key={`generated-image-container-${index + 1}`}
                                            className={`relative block m-auto h-auto w-full rounded`}>
                                            <Image
                                                src={`data:image/png;base64,${contentSrc}`}
                                                alt={`Generated Image ${index + 1}`}
                                                height={"300"}
                                                width={"300"}
                                                className={"block m-auto h-auto w-full rounded"}
                                                key={`generated-image-${index + 1}`}
                                                ref={index === 0 ? image1Ref :
                                                    index === 1 ? image2Ref :
                                                        index === 2 ? image3Ref : null}
                                            />
                                        </div>
                                        <div key={`genrated-image-download-icon-container-${index + 1}`}
                                            className={"absolute bottom-0 right-0 m-5 \
                                        bg-green-standard text-black rounded cursor-pointer w-fit p-2"}>
                                            <FaDownload
                                                key={`generated-image-download-icon-${index + 1}`}
                                                onClick={() => triggerImagesDownload((index + 1).toString())}
                                            />
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                        <button className={"bg-green-standard p-2 text-black font-black rounded"}
                            onClick={() => triggerImagesDownload("all")}>Download All</button>
                    </>
                )}
            </div >
        </>
    );
}
