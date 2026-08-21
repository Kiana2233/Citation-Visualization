
import { createApp } from 'vue'
import mitt from 'mitt'
import App from './App.vue'
import './styles/base.css'

const emitter = mitt()
const app = createApp(App)

app.provide('emitter', emitter)
app.mount('#app')
