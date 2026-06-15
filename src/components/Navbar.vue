<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">UrbanStyle</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Abrir menú"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mainNavbar" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Inicio</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/catalogo">Catálogo</RouterLink>
          </li>
          <li v-if="isAdminUser" class="nav-item">
            <RouterLink class="nav-link" to="/admin">Admin</RouterLink>
          </li>
          <li v-if="isAdminUser" class="nav-item">
            <RouterLink class="nav-link" to="/admin/usuarios">Usuarios</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/carrito">Carrito</RouterLink>
          </li>
          <template v-if="currentUser">
            <li class="nav-item text-white-50 small ms-lg-2">Hola, {{ currentUser.nombre || currentUser.name }}</li>
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm" type="button" @click="logout">
                <i class="bi bi-box-arrow-right me-1"></i>
                Salir
              </button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">
                <i class="bi bi-person-lock me-1"></i>
                Login
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="btn btn-outline-light btn-sm ms-lg-2" to="/registro">Registro</RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentUser, logoutUser, isAdmin } from '../services/authService'

const route = useRoute()
const router = useRouter()
const currentUser = ref(null)
const isAdminUser = ref(false)

const updateUserData = () => {
  currentUser.value = getCurrentUser()
  isAdminUser.value = isAdmin()
}

onMounted(updateUserData)

watch(
  () => route.fullPath,
  () => {
    updateUserData()
  },
)

function logout() {
  logoutUser()
  currentUser.value = null
  isAdminUser.value = false
  router.push('/')
}
</script>
