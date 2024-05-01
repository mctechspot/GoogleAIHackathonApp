"use client"
import { useContext } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import Link from "next/link";
import { GiQuillInk } from "react-icons/gi";
import { ImQuill } from "react-icons/im";
import {
    MdDarkMode,
    MdLightMode,
    MdOutlineDarkMode,
    MdOutlineLightMode
} from "react-icons/md";


export default function ThemeToggle() {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);

    return (
        <>
            <div className={`absolute right-0 flex gap-2 justify-end items-center p-5 text-xl z-10 \
            ${lightTheme ? ("text-green-dark") : ("text-green-pale")}`}>
                <Link href={`/generate`}
                    className={`block text-center font-black mr-5`}>
                    <ImQuill />
                </Link>
                <div className={"cursor-pointer"}
                    onClick={() => setLightTheme(true)}>
                    {lightTheme ? (<MdLightMode />) : (<MdOutlineLightMode />)}
                </div>
                <div className={"cursor-pointer"}
                    onClick={() => setLightTheme(false)}>
                    {!lightTheme ? (<MdDarkMode />) : (<MdOutlineDarkMode />)}
                </div>
            </div>
        </>
    );
}