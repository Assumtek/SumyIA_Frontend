import { NextRequest, NextResponse } from "next/server";
import { getCookiesServer } from "./lib/cookieServer";
import { api, apiWithCache } from "./app/services/api";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    role: string;
    email: string;
    userId: string;
    iat: number;
    exp: number;
}

// Cache em memória
const userCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minuto em milissegundos

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
        console.log('Verificando cache para usuário...');
        
        if (!token) {
            console.error('Token não encontrado');
            return NextResponse.redirect(new URL('/login', req.url));
        }
        
        // Verifica se existe no cache e se ainda é válido
        const cachedData = userCache.get(token);
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
            console.log('Usando dados do cache');
            return NextResponse.next();
        }

        console.log('Fazendo nova requisição para /api/usuarios');
        try {
            const response = await apiWithCache.get("/api/usuarios", {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Atualiza o cache
            userCache.set(token, {
                data: response.data,
                timestamp: now
            });
            
            console.log('Cache atualizado com sucesso');
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
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

