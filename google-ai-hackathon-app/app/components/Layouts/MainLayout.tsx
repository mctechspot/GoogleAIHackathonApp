"use client"
import contextProvider, { createContext, useContext, useEffect, useState } from "react"
import ThemeToggle from "@/app/components/Toggles/ThemeToggle"
import UserSideBar from "@/app/components/User/UserSideBar"
export const ThemeContext = createContext({});
import { SessionProvider } from "next-auth/react"

export default function MainLayout({ children }: { children: React.ReactNode }) {

    const [lightTheme, setLightTheme] = useState<boolean>(true);

    /*useEffect(() => {
        fetchCurrentTheme();
    }, []);*/

    // Function to get and set current theme based on value in localStorage
    /*const fetchCurrentTheme = () => {
        const currentTheme = localStorage.getItem("theme");
        console.log(currentTheme)
        if (!currentTheme || (currentTheme && JSON.stringify(currentTheme).trim().toLowerCase() === "light")) {
            setLightTheme(true);
        }else{
            setLightTheme(false);
        }
        console.log(currentTheme);
    }*/

    // Function to update theme in local storage when lightTheme state changes
    const updateThemeInLocalStorage = () => {
        if (lightTheme) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    }

    useEffect(() => {
        updateThemeInLocalStorage();
    }, [lightTheme]);

    return (
        <>
            <SessionProvider>
                <ThemeContext.Provider value={{ lightTheme, setLightTheme }}>
                    <div className={`${lightTheme ? ("bg-white") : ("bg-green-dark")}`}>
                        <UserSideBar />
                        <ThemeToggle />
                        {children}
                    </div>
                </ThemeContext.Provider>
            </SessionProvider>
        </>
    );
}