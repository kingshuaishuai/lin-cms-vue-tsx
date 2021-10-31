import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    jsx(),
    ViteComponents({
      customComponentResolvers: [AntDesignVueResolver()]
    })
  ],
  base: '',
  resolve: {
    alias: {
      '@': '/src',
      '@style': '/src/assets/style'
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
})
