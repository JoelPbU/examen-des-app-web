import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/styles.css'
import App from './App.vue'
import router from './router'
import { seedProductsIfEmpty } from './services/productService'
import { seedUsersIfEmpty } from './services/userService'

seedProductsIfEmpty()
seedUsersIfEmpty()

createApp(App).use(router).mount('#app')
