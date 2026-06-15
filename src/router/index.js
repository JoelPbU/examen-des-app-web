import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CatalogView from '../views/CatalogView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import AdminProductsView from '../views/AdminProductsView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'
import CartView from '../views/CartView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { isAuthenticated, isAdmin } from '../services/authService'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/catalogo', name: 'catalog', component: CatalogView },
  { path: '/producto/:id', name: 'product-detail', component: ProductDetailView, props: true },
  { path: '/admin', name: 'admin-products', component: AdminProductsView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/usuarios', name: 'admin-users', component: AdminUsersView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/carrito', name: 'cart', component: CartView },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  { path: '/registro', name: 'register', component: RegisterView, meta: { guestOnly: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const loggedIn = isAuthenticated()
  const isUserAdmin = isAdmin()

  if (to.meta.requiresAuth && !loggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !isUserAdmin) {
    return { path: '/' }
  }

  if (to.meta.guestOnly && loggedIn) {
    return isUserAdmin ? '/admin' : '/'
  }

  return true
})

export default router
