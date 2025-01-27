import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins:[react()],
    // server:{
    //     port:8080
    // }

    // server:{
    //     proxy:{
    //         '/':{
    //             target:'',
    //             changeOrigin: true,
    //             secure: false,
    //         }
    //     }
    // }
})