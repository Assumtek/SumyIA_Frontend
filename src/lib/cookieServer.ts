import { cookies } from "next/headers";

export function getCookiesServer(){
    const token = cookies().get("session")?.value
    
    return token || null
}