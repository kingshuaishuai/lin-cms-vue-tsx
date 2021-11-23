import { createApp } from 'vue'
import App from './App'
import router from './router'
import './assets/style/index.less'
import { pinia } from './store'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
