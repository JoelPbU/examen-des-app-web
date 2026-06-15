<template>
  <section class="auth-section py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-5">
          <div class="card border-0 shadow-sm auth-card">
            <div class="card-body p-4 p-md-5">
              <span class="text-uppercase text-secondary small fw-bold">UrbanStyle</span>
              <h1 class="h3 fw-bold mt-2 mb-3">Iniciar sesión</h1>
              <p class="text-secondary">Accede para gestionar los productos de la tienda.</p>

              <div v-if="error" class="alert alert-danger">{{ error }}</div>

              <form @submit.prevent="submitLogin">
                <div class="mb-3">
                  <label class="form-label" for="username">Usuario o correo</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <input id="username" v-model.trim="form.username" class="form-control" required />
                  </div>
                </div>
                <div class="mb-4">
                  <label class="form-label" for="password">Contraseña</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                    <input id="password" v-model="form.password" class="form-control" type="password" required />
                  </div>
                </div>
                <button class="btn btn-dark w-100" type="submit" :disabled="loading">
                  <i class="bi bi-box-arrow-in-right me-1"></i>
                  {{ loading ? 'Validando...' : 'Entrar' }}
                </button>
              </form>

              <p class="text-center text-secondary mt-4 mb-0">
                ¿No tienes cuenta?
                <RouterLink to="/registro">Regístrate aquí</RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loginUser } from '../services/authService'

const route = useRoute()
const router = useRouter()
const error = ref('')
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
})

async function submitLogin() {
  error.value = ''
  loading.value = true

  try {
    await loginUser(form)
    router.push(route.query.redirect || '/admin')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
