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
            <div className={`flex flex-col justify-between`}>

                <div className={""}>
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

                        <div className={`${lightTheme ? ("text-black") : ("text-white")} my-[50px]`}>

                            <p className={"text-green-text text-lg font-black text-center"}>Jenna's Mission for Responsible AI</p><br />

                            <p>
                                Jenna is designed to leverage the power of Generative Artificial Intelligence
                                as a means of allowing users to produce creative content in the form of
                                literature pieces and art pieces with customised text and image prompts
                                provided by a user.
                            </p><br />

                            <p>
                                Our backend services leverage the &nbsp;
                                <Link href={"https://ai.google.dev/"}
                                    className={`text-green-text font-black`} target={"_blank"}>
                                    Google Vertex AI API and the Google Gemini API
                                </Link>&nbsp;
                                to generate text and image content based on user prompts. It is important to note
                                that our tool strives to minimise the generation of  inappropriate content.
                            </p><br />

                            <p className={`font-black`}>
                                What constitutes inappropriate content?
                            </p>
                            <ul>
                                <div className={`ml-5`}>
                                    <li>Violence</li>
                                    <li>Sensual Content</li>
                                    <li>Offensive content against demographics</li>
                                </div>
                            </ul><br />

                            <p>
                                If our service detects prompts that could potentially produce content that
                                falls under any of the aforementioned inappropriate categories, the content
                                generation request will be blocked, and a warning message will be displayed to
                                indicate that the user must enter an appropriate prompt.
                            </p><br />

                            <p>
                                These stipulations allow Jenna to be a fun, creative and hospitable tool for
                                everyone to use.
                            </p><br />

                            <p>
                                Have fun and use Jenna responsibly!
                            </p>
                        </div>

                        <Link href={"/generate"}
                            className={`block bg-green-standard px-10 py-5 w-fit m-auto \ 
                            text-green-dark text-center font-black rounded-lg`}>
                            Try
                        </Link>
                    </div>

                </div><br />

                {/* Footer */}
                <div>
                    <Footer />
                </div>

            </div>
        </>
    );
}