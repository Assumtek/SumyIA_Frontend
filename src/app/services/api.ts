import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

export const api = axios.create({
    // url passa na vercel
    baseURL: process.env.NEXT_PUBLIC_API
})

export const apiWithCache = setupCache(api, {
    ttl: 60 * 1000, // 1 minuto em milissegundos
    methods: ['get'],
    cachePredicate: (response) => {
        return response.status === 200;
    },
    debug: (msg) => {
        console.log('Cache Debug:', msg);
    },
    interpretHeader: true,
    etag: true,
    modifiedSince: true,
    staleIfError: true
});