import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as fs from 'fs'
import path from 'path'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  server: {
    open: true,
    // https: {
    //   key: fs.readFileSync('localhost-key.pem'),
    //   cert: fs.readFileSync('localhost.pem'),
    // },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // TODO: not sure why this alias isn't working..
  resolve: {
    alias: {
      '/@/': path.resolve(__dirname, './src'),
    },
  },
})
