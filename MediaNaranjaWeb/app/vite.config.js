import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El proxy /img/* replica lo que hace Netlify en produccion (ver netlify.toml).
// Sin esto, en dev y preview las imagenes dan 404 y no se puede medir ni probar
// nada parecido a lo real.
const proxyImg = {
  '/img': {
    target: process.env.VITE_SUPABASE_URL || 'https://dqlixhlsbyofejjqexzl.supabase.co',
    changeOrigin: true,
    rewrite: (ruta) => ruta.replace(/^\/img/, '/storage/v1/object/public'),
  },
}

export default defineConfig({
  plugins: [react()],
  server: { proxy: proxyImg },
  preview: { proxy: proxyImg },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
