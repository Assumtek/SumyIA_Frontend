import { NextRequest, NextResponse } from "next/server";
import { getCookiesServer } from "./lib/cookieServer";
import { api } from "./app/services/api";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    role: string;
    email: string;
    userId: string;
    iat: number;
    exp: number;
}

export async function middleware(req: NextRequest) {
    // Pega o caminho da pagina
    const { pathname } = req.nextUrl

    //  A documentação pede isso...
    if (pathname.startsWith("/_next") || 
        pathname === "/" || 
        pathname.startsWith("/images") || 
        pathname.startsWith("/assets") ||
        pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
        return NextResponse.next()
    }

    //  Pega o token JWT nos cookies
    const token = getCookiesServer()

    if (!token && pathname !== "/login" && pathname !== "/" && pathname !== "/register"  && pathname !== "/reset-password" && pathname !== "/forgot-password" && pathname !== "/admin") {
        return NextResponse.redirect(new URL('/login', req.url))
    }
    
    // se o user estive em uma rota que começa com conversa ele faz um fatch para http://localhost:3333/api/usuarios/
    if (pathname.startsWith("/conversa")) {
        console.log('Middleware de conversa');
        if (!token) {
            console.error('Token não encontrado');
            return NextResponse.redirect(new URL('/login', req.url));
        }

        try {
            const response = await api.get("/api/usuarios", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const documentos = response.data._count.documentos;
            const feedbacks = response.data._count.feedbacks;

            console.log(response.data);

            if (documentos >= 2 && feedbacks < 1) {
                console.log('Redirecionando para feedback');
                console.log(documentos);
                console.log(feedbacks);
                return NextResponse.redirect(new URL('/feedback', req.url));
            }

            return NextResponse.next();
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            return NextResponse.next();
        }
    }

    if (pathname === "/admin") {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
        
        // Pega as informações do token
        const user = jwtDecode(token) as JwtPayload

        // Verifica se o usuário é ADMIN
        if (user.role !== "ADMIN") {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    return NextResponse.next();
}

