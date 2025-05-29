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

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next();
}

