import Image from "next/image";
import Logo from "@/public/assets/logo-dark.png";
import Link from "next/link";
import Footer from "@/app/components/Navigation/Footer"

export default function About() {
    return (
        <>
            <div className={`h-screen flex flex-col justify-between`}>

                <div className={"h-full w-full flex justify-center items-center"}>
                    <div className={"mx-[50px]"}>
                        <Link href={"/"}>
                            <Image
                                src={Logo}
                                alt={"Logo"}
                                height={"106"}
                                width={"250"}
                                className={"block m-auto mb-2 h-auto w-[250px]"}
                            />
                        </Link>


                        <div className={`text-center my-[50px]`}>

                            <p className={"text-green-text text-lg font-black"}>About Jenna</p><br />

                            <p>Jenna is a play on the term Generative Artificial Intelligence or GenAI for short.</p><br />

                            <p>
                                The tool leverages Google Vertex AI and Google Gemini to generate
                                stories, poems and songs for text and image prompts.
                            </p><br />

                            <p>Get creative!</p>
                        </div>

                        <Link href={"/generate"}
                            className={"block bg-green-standard px-10 py-5 w-fit m-auto text-center rounded-lg"}>
                            Try
                        </Link>
                    </div>

                </div>

                <div>
                    <Footer />
                </div>

            </div>
        </>
    );
}
