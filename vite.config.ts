import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // 如果你的 GitHub 仓库链接是 https://github.com/username/my-portfolio
  // 那么这里必须填 '/my-portfolio/'
  base: '/-superweb/', 
  plugins: [
    react(),
    tailwindcss(),
  ],
})