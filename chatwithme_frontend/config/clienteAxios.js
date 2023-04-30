import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const clienteAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})


export default clienteAxios