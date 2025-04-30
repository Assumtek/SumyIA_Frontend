import axios from "axios";

export const api = axios.create({
    // url passa na vercel
    baseURL: process.env.NEXT_PUBLIC_API
})