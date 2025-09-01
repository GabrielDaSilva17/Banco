import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Banco/',
  define: {
    // Expose environment variables to the client-side code.
    // JSON.stringify is used to wrap the variable in quotes.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})