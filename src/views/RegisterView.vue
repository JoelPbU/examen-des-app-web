<template>
  <section class="auth-section py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-5">
          <div class="card border-0 shadow-sm auth-card">
            <div class="card-body p-4 p-md-5">
              <span class="text-uppercase text-secondary small fw-bold">UrbanStyle</span>
              <h1 class="h3 fw-bold mt-2 mb-3">Crear cuenta</h1>
              <p class="text-secondary">Regístrate para acceder al panel de administración.</p>

              <div v-if="error" class="alert alert-danger">{{ error }}</div>

              <form @submit.prevent="submitRegister">
                <div class="mb-3">
                  <label class="form-label" for="name">Nombre</label>
                  <input id="name" v-model.trim="form.name" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="email">Correo</label>
                  <input id="email" v-model.trim="form.email" class="form-control" type="email" required />
                </div>
                <div class="mb-4">
                  <label class="form-label" for="password">Contraseña</label>
                  <input id="password" v-model="form.password" class="form-control" minlength="6" type="password" required />
                  <div class="form-text">Mínimo 6 caracteres.</div>
                </div>
                <button class="btn btn-dark w-100" type="submit">Crear cuenta</button>
              </form>

              <p class="text-center text-secondary mt-4 mb-0">
                ¿Ya tienes cuenta?
                <RouterLink to="/login">Inicia sesión</RouterLink>
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
import { useRouter } from 'vue-router'
import { registerUser } from '../services/authService'

const router = useRouter()
const error = ref('')
const form = reactive({
  name: '',
  email: '',
  password: '',
})

function submitRegister() {
  error.value = ''

  try {
    registerUser(form)
    router.push('/admin')
  } catch (err) {
    error.value = err.message
  }
}
</script>
