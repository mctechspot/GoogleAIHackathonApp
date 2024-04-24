"use client"
import { useContext } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout"
import Image from "next/image";
import LogoLight from "@/public/assets/logo.png";
import LogoDark from "@/public/assets/logo-dark.png";
import Link from "next/link";
import Footer from "@/app/components/Navigation/Footer";

export default function About() {
    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    return (
        <>
            <div className={`h-screen flex flex-col justify-between`}>

                <div className={"h-full w-full flex justify-center items-center"}>
                    <div className={"mx-[50px]"}>
                        <Link href={"/"}>
                            <Image
                                src={lightTheme ? LogoLight : LogoDark}
                                alt={"Logo"}
                                height={"106"}
                                width={"250"}
                                className={"block m-auto mb-2 h-auto w-[250px]"}
                            />
                        </Link>

                        <div className={`${lightTheme ? ("text-black"): ("text-white")} text-center my-[50px]`}>

                            <p className={"text-green-text text-lg font-black"}>About Jenna</p><br />

                            <p>Jenna is a play on the term GenAI which stands for Generative Artificial Intelligence.</p><br />

                            <p>
                                The tool leverages Google Vertex AI and Google Gemini to generate
                                stories, poems, plays, songs and art images for your customised prompts.
                            </p><br />

                            <p>Get creative!</p>
                        </div>

                        <Link href={"/generate"}
                            className={"block bg-green-standard px-10 py-5 w-fit m-auto text-center font-black rounded-lg"}>
                            Try
                        </Link>
                    </div>

                </div>

                {/* Footer */}
                <div>
                    <Footer />
                </div>

            </div>
        </>
    );
}
