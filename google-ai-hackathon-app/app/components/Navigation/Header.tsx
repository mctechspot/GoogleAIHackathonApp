"use client"
import { useContext } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import Image from "next/image";
import Link from "next/link";
import LogoLight from "@/public/assets/logo.png";
import LogoDark from "@/public/assets/logo-dark.png";

export default function Footer() {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const startYear: number = 2024;
    const currentYear: number = new Date().getFullYear();

    return (
        <>
            <div className={`${lightTheme ? ("bg-white") : ("bg-green-dark")} p-5`}>
                <Link href={"/"}>
                    <Image
                        src={lightTheme ? LogoLight : LogoDark}
                        alt={"Logo"}
                        height={"75"}
                        width={"150"}
                        className={"block m-auto mb-2 h-auto w-[150px]"}
                    />
                </Link>
            </div>
        </>
    );
}
