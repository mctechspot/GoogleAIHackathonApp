"use client"
import { useContext } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import Link from "next/link";
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
            <div className={`absolute flex gap-2 justify-end w-full items-center p-5 text-xl \
            ${lightTheme ? ("text-black") : ("text-green-pale")}`}>
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
