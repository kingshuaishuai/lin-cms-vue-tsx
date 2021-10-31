import { createApp } from 'vue'
import App from './App'
import router from './router'
import { store, key } from './store'
import './assets/style/index.less'

const app = createApp(App)

app.use(router)
app.use(store, key)
app.mount('#app')
