import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'
import router from './router'

const app = createApp(App)
const emitter = mitt()
app.config.globalProperties.emitter = emitter
app.provide('emitter', emitter)
app.use(router).mount('#app')
