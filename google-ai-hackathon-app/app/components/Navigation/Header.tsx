"use client"
import { useContext } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import Image from "next/image";
import Link from "next/link";
import LogoLight from "@/public/assets/logo.png";
import LogoDark from "@/public/assets/logo-dark.png";

export default function Header() {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);

    return (
        <>
            <div className={`${lightTheme ? ("bg-white") : ("bg-green-dark")} p-5`}>
                <Link href={"/"} className={"block m-auto w-fit"}>
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
