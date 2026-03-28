/**import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
    }
})
*/
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5018',
                changeOrigin: true,
                secure: false
            }
        }
    }
})