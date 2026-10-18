import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS === 'true'
    ? '/TESTE-3-/'   // nome exato do repositório
    : '/',
})
