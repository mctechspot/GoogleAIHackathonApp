"use client"
import { useContext, useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react';
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import Image from "next/image";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


export default function UserSideBar() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const [openUserSideBar, setOpenUserSideBar] = useState<boolean>(false);

    return (
        <>
            {status === "authenticated" ? (
                <>
                    {openUserSideBar ?
                        (
                            <>
                                <div className={`absolute ${lightTheme ? ("bg-white") : ("bg-green-dark")} top-0 bottom-0 z-10 border border-solid border-r-green-standard max-w-[250px]`}>
                                    <div className={"p-5"}>
                                        <div className={`flex justify-end text-xl font-black \
                                        cursor-pointer ${lightTheme ? ("text-black") : ("text-green-standard")}`}
                                            onClick={() => setOpenUserSideBar(false)}>
                                            <IoClose />
                                        </div><br />

                                        <Image
                                            src={session.user?.image ? session.user?.image : ""}
                                            alt={"Home Banner"}
                                            height={"40"}
                                            width={"40"}
                                            className={"block m-auto mb-2 h-[40px] w-[40px] rounded-full"}
                                        /><br />

                                        <div className={`${lightTheme ? ("text-black") : ("text-white")}`}>
                                            <p className={"text-center"}>{session.user?.name}</p><br />
                                            <p className={"text-center"}>{session.user?.email}</p><br />
                                        </div>

                                        <button className={`block bg-green-standard p-2 w-fit m-auto \ 
                                text-center font-black rounded-lg cursor-pointer`}
                                            onClick={() => {
                                                signOut();
                                            }}>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) :
                        (
                            <>
                                <button className={`absolute ${lightTheme ? ("text-black") : ("text-white")} \
                                    text-2xl p-5 cursor-pointer h-fit w-fit`}
                                    onClick={() => setOpenUserSideBar(true)}>
                                    <FaRegUserCircle />
                                </button >
                            </>
                        )}
                </>
            ) : ("")}
        </>
    );
}