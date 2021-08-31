import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#efos')
//@ts-ignore
if (module.hot) {
    //@ts-ignore
    module.hot.accept()
}
