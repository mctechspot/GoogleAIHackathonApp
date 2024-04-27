"use client"
import { useContext, useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react';
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import Image from "next/image";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";


export default function UserSideBar() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);
    const [openUserSideBar, setOpenUserSideBar] = useState<boolean>(false);

    useEffect (() => {
        if(status === "authenticated"){
            checkForUserInDb();
        }
    }, [status]);

    const checkForUserInDb = async() => {
        try{
            const payload = {
                "email": session?.user?.email
            }
            const checkForUserInDbRes = await fetch(`/api/check-for-user-in-db`, {
                "method": "POST",
                "body": JSON.stringify(payload)
            });
            const checkForUserInDbJson = await checkForUserInDbRes.json();

        }catch(error: any){
            console.log(`Error checking for user in database: ${error.mesage}.`);
        }
    };

    return (
        <>
            {openUserSideBar ? (
                <>
                    <div className={`absolute ${lightTheme ? ("bg-white") : ("bg-green-dark")} z-10 top-0 bottom-0 border border-solid border-r-green-standard max-w-[250px]`}>
                        <div className={"p-5"}>
                            <div className={`flex justify-end text-xl font-black \
                                        cursor-pointer ${lightTheme ? ("text-green-dark") : ("text-green-standard")}`}
                                onClick={() => setOpenUserSideBar(false)}>
                                <IoClose />
                            </div><br />

                            {status === "authenticated" ? (
                                <>
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

                                    <button className={`block bg-green-standard text-green-dark p-2 w-fit m-auto \ 
                                text-center font-black rounded-lg cursor-pointer`}
                                        onClick={() => {
                                            signOut();
                                        }}>
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className={`${lightTheme ? ("text-black") : ("text-white")} text-center`}>You are not signed in and so your results will not be saved.</p><br />
                                    <button className={`block bg-green-standard p-2 w-fit m-auto \ 
                                text-center font-black rounded-lg cursor-pointer`}
                                        onClick={() => {signIn()}}>
                                        <div className={"flex items-center gap-2"}>
                                            <FcGoogle />
                                            <span className={`text-green-dark`}>Sign In with Google</span>
                                        </div>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) :
                (
                    <>
                        <button className={`absolute ${lightTheme ? ("text-green-dark") : ("text-white")} \
                                    text-2xl p-5 cursor-pointer h-fit w-fit z-10`}
                            onClick={() => setOpenUserSideBar(true)}>
                            <FaRegUserCircle />
                        </button >
                    </>
                )}
        </>
    );
}