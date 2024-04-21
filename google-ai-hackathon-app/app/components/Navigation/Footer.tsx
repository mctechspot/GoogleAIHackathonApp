import Link from "next/link";

export default function Footer() {

    const startYear: number = 2024;
    const currentYear: number = new Date().getFullYear();

    return (
        <>
            <div className={"bg-white flex justify-center gap-2 p-5"}>
                <p>&copy; {currentYear > startYear ?  `${startYear} - ${currentYear}` : `${startYear}`} jenna </p>
                <span>|</span>
                <Link href={"/about"}>about</Link>
            </div>
        </>
    );
}
