"use client"
import { RefObject, useEffect, useRef, useState } from "react"
import { ContentDropdownProps, UserFormProps, UserFormType } from "@/app/types/Forms"
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { literatureContentTypes, artContentTypes, artOrientations } from "@/app/constants/DropdownConstants"

export default function ContentTypeDropdown({ userPrompt, setUserPrompt, contentCategory }: UserFormType) {


    const [openDropdown, setOpenDropdown] = useState<boolean>(false);
    const dropdownRef: RefObject<HTMLDivElement> | null = useRef(null);
    const [dropdownData, setDropdownData] = useState<any[]>(literatureContentTypes);

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

    useEffect(() => {
        if(contentCategory === 1){
            setDropdownData(literatureContentTypes);
        }else{
            setDropdownData(artContentTypes);
        }
    }, [contentCategory]);

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
                                {dropdownData.find((dropdownDataEntry: ContentDropdownProps, index: number) => dropdownDataEntry.key === userPrompt.content_type).value}
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
                            {dropdownData.map((dropdownDataEntry: any, index: number) => {
                                return (
                                    <>
                                        <div
                                            className={`${userPrompt.content_type === dropdownDataEntry.key ? "bg-green-standard" : ""}
                                    hover:bg-green-standard w-full py-2 px-10 w-full cursor-pointer`}
                                            onClick={() => {
                                                setUserPrompt({ ...userPrompt, content_type: dropdownDataEntry.key });
                                                setOpenDropdown(false);
                                            }}>
                                            {dropdownDataEntry.value}
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
