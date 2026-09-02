// Config aparte para renderizar la app a HTML.
// La de produccion parte el bundle en chunks (vendor/motion/supabase); eso no
// aplica cuando el objetivo es un unico modulo que corre en Node.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { ssr: 'src/entry-server.jsx', outDir: 'dist-ssr', emptyOutDir: true },
})
