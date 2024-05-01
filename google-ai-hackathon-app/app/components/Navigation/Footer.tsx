"use client"
import { useContext } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import Link from "next/link";

export default function Footer() {
    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const startYear: number = 2024;
    const currentYear: number = new Date().getFullYear();

    return (
        <>
            <div className={`${lightTheme ? ("bg-white") : ("bg-green-dark text-green-pale")} flex justify-center gap-2 p-5`}>
                <p>&copy; {currentYear > startYear ?  `${startYear} - ${currentYear}` : `${startYear}`} jenna </p>
                <span>|</span>
                <Link href={"/about"}>about</Link>
                <span>|</span>
                <Link href={"/responsible-ai"}>responsible ai</Link>
            </div>
        </>
    );
}
