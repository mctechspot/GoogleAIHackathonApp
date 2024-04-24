"use client"
import { useContext } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout"
import Image from "next/image";
import BannerLight from "@/public/assets/banner.gif";
import BannerDark from "@/public/assets/banner-dark.gif";
import { useSession, signIn, signOut } from "next-auth/react"
import { FcGoogle } from "react-icons/fc";

import Link from "next/link";
import Footer from "@/app/components/Navigation/Footer";

export default function Home() {

  const { lightTheme, setLightTheme }: any = useContext(ThemeContext);

  return (
    <>
      <div className={`h-screen flex flex-col justify-between`}>

        <div className={"h-full w-full flex justify-center items-center"}>
          <div>
            <Link href={"/"}>
              <Image
                src={lightTheme ? BannerLight : BannerDark}
                alt={"Home Banner"}
                height={"106"}
                width={"250"}
                className={"block m-auto mb-2 h-auto w-full"}
              />
            </Link>

            <button
              className={"block bg-green-standard px-10 py-5 w-fit m-auto text-center font-black rounded-lg"}
              onClick={() => signIn()}>
              <div className={"flex items-center gap-2"}>
                <FcGoogle />
                <span>Sign In with Google</span>
              </div>
            </button><br />

            <Link href={"/generate"}
              className={"block bg-green-standard px-10 py-5 w-fit m-auto text-center font-black rounded-lg"}>
              Try without Account
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
