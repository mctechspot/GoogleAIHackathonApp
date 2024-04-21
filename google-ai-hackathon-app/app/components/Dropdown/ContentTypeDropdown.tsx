"use client"
import { RefObject, useEffect, useRef, useState } from "react"
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/assets/logo-dark.png";
import { ContentDropdownProps, UserFormProps, UserFormType } from "@/app/types/Forms"
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function ContentTypeDropdown({ userPrompt, setUserPrompt }: UserFormType) {

    const [openDropdown, setOpenDropdown] = useState<boolean>(false);
    const dropdownRef: RefObject<HTMLDivElement> | null = useRef(null);
    const contentTypes: any[] = [
        {
            "key": "1",
            "value": "Story"
        },
        {
            "key": "2",
            "value": "Poem"
        },
        {
            "key": "3",
            "value": "Song"
        }
    ];

    useEffect(() => {
        window.addEventListener('click', toggleDropdown);
        return () => {
            window.removeEventListener('click', toggleDropdown);
        };
    }, []);

    const toggleDropdown = (event: any): void => {
        const dropdownRefElement = dropdownRef?.current;
        if (dropdownRefElement && !dropdownRefElement.contains(event.target)) {
            event.stopPropagation();
            setOpenDropdown((prevValue) => false);
        };
    };

    return (
        <>
            <div className={"w-fit relative"} ref={dropdownRef}>
                {/* Dropdown Header */}
                <div className={"border border-green-standard rounded p-2 min-w-[119.37px] cursor-pointer"}
                    onClick={(event) => {
                        event.stopPropagation();
                        setOpenDropdown(!openDropdown);
                    }}>
                    <div>
                        <div className={"flex items-center justify-center gap-2"}>
                            <div>
                                {contentTypes.find((item: ContentDropdownProps, index: number) => item.key === userPrompt.contentType).value}
                            </div>
                            <div className={"text-green-text"}>
                                {openDropdown ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                        </div>
                    </div>
                </div>

                {openDropdown ? (
                    <>
                        {/* Dropdown Options */}
                        <div className={"absolute bg-white border border-green-standard rounded mt-2"}>
                            {contentTypes.map((contentType: any, index: number) => {
                                return (
                                    <>
                                        <div
                                            className={`${userPrompt.contentType === contentType.key ? "bg-green-standard" : ""}
                                    hover:bg-green-standard w-full py-2 px-10 w-full cursor-pointer`}
                                            onClick={() => {
                                                setUserPrompt({ ...userPrompt, contentType: contentType.key });
                                                setOpenDropdown(false);
                                            }}>
                                            {contentType.value}
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </>
                ) : ("")}

            </div>
        </>
    );
}
