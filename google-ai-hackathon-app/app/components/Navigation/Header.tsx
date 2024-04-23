import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/assets/logo.png";

export default function Footer() {

    const startYear: number = 2024;
    const currentYear: number = new Date().getFullYear();

    return (
        <>
            <div className={"bg-white p-5"}>
                <Link href={"/"}>
                    <Image
                        src={Logo}
                        alt={"Logo"}
                        height={"50"}
                        width={"100"}
                        className={"block m-auto mb-2 h-auto w-[100px]"}
                    />
                </Link>
            </div>
        </>
    );
}
