"use client"
import Link from "next/link";
import contextProvider, { createContext, useContext, useEffect, useState } from "react"
import ThemeToggle from "@/app/components/Toggles/ThemeToggle"
import UserSideBar from "@/app/components/User/UserSideBar"
export const ThemeContext = createContext({});
import { SessionProvider } from "next-auth/react"

export default function MainLayout({ children }: { children: React.ReactNode }) {

    const [lightTheme, setLightTheme] = useState<boolean | null>(null);

    useEffect(() => {
        fetchCurrentTheme();
    }, []);

    // Initialise theme if present in localStorage
    const fetchCurrentTheme = () => {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme && (currentTheme.trim().toLowerCase() === "dark")) {
            setLightTheme(false);
        } else {
            setLightTheme(true);
        }
    }

    // Update theme in  local starge when lightTheme state variable changes
    const updateThemeInLocalStorage = () => {
        if (lightTheme) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    }

    useEffect(() => {
        if (lightTheme !== null) {
            updateThemeInLocalStorage();
        }
    }, [lightTheme]);

    return (
        <>
            <SessionProvider>
                <ThemeContext.Provider value={{ lightTheme, setLightTheme }}>
                    <>
                        {lightTheme !== null ? (
                            <div className={`${lightTheme ? ("bg-white") : ("bg-green-dark")} fade-in`}>
                                <UserSideBar />
                                <ThemeToggle />
                                {children}
                            </div>
                        ) : ("")}

                    </>
                </ThemeContext.Provider>
            </SessionProvider>
        </>
    );
}