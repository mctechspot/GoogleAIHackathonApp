"use client"
import { useContext } from "react"
import { ThemeContext } from "@/app/components/Layouts/MainLayout";
import { CgSpinner } from "react-icons/cg";

export default function LoadSpinner() {

    const { lightTheme, setLightTheme }: any = useContext(ThemeContext);

    return (
        <>
            <div className={"flex justify-center items-center text-green-standard"}>
                <CgSpinner className={"spin text-[100px]"} />
            </div>
        </>
    );
}
