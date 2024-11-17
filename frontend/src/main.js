import { createApp } from 'vue'
import App from './App.vue'
import logger from './logger'

const app = createApp(App)
    .use(logger)
    .mount('#app')

export default app
