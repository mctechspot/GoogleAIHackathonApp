"use client"
import { useContext } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout"
import Link from "next/link";
import Header from "@/app/components/Navigation/Header";
import Footer from "@/app/components/Navigation/Footer";
import { MdError } from "react-icons/md";

export default function Error404Page() {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);

    return (
        <>
            <div className={`h-screen flex flex-col justify-between`}>

                {/* Header */}
                <div>
                    <Header />
                </div>

                <div className={"mx-20 mb-5 max-[450px]:mx-10 fade-in"}>
                    <div className={`${lightTheme ? ("text-black") : ("text-white")} text-center`}>
                        <div className={`${lightTheme ? ("text-black") : ("text-green-standard")} \
                flex justify-center items-center text-[80px]`}>
                            <MdError />
                        </div>
                        <p>Oops! An error ha occurred.</p><br />
                        <p>Let's take you back to the &nbsp; <br />
                            <Link href={"/generate"} className={"text-green-text font-black"}>Generate Content</Link>
                            &nbsp; page.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div>
                    <Footer />
                </div>

            </div >
        </>
    );
}
