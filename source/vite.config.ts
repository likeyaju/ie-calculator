import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [vue(), ...(mode.endsWith('single') ? [viteSingleFile()] : [])],
  build: { target: 'es2018', assetsInlineLimit: 100000000 }
}))
