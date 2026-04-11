import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // 既然你使用了自定义域名 (https://www.skyhome.studio)，
  // 网站会部署在根目录，所以 base 必须改回 '/'
  base: '/', 
  plugins: [
    react(),
    tailwindcss(),
  ],
})