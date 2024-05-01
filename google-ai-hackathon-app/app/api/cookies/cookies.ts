'use server'

import { cookies } from "next/headers"

export const getCookieData = async () => {
    const cookieData = cookies();
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve(cookieData)
        }, 1000)
    )
}