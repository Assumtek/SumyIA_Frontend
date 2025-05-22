import { NextRequest, NextResponse } from "next/server";
import { getCookiesServer } from "./lib/cookieServer";
import { api } from "./app/services/api";

export async function middleware(req: NextRequest) {
    // Pega o caminho da pagina
    const { pathname } = req.nextUrl

    //  A documentação pede isso...
    if (pathname.startsWith("/_next") || pathname === "/") {
        return NextResponse.next()
    }

    //  Pega o token JWT nos cookies
    const token = getCookiesServer()

    if (pathname.startsWith("/home")) {

        // Se não tiver um JWT ele manda para pagina de login
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url))
        }

        const response = await api.get("/api/usuarios/", {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response)

        const user = response.data

        console.log(user)
    }
}

