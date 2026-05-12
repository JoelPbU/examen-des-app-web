import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/styles.css'
import App from './App.vue'
import router from './router'
import { seedProductsIfEmpty } from './services/productService'

seedProductsIfEmpty()

createApp(App).use(router).mount('#app')
