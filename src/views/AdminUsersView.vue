<template>
  <section class="container py-5">
    <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
      <div>
        <span class="text-uppercase text-secondary small fw-bold">Administración</span>
        <h1 class="fw-bold mb-0">CRUD de usuarios</h1>
      </div>
      <button class="btn btn-dark align-self-start" type="button" @click="openCreateModal">
        <i class="bi bi-plus-lg me-1"></i>
        Crear usuario
      </button>
    </div>

    <div v-if="alert.message" :class="`alert alert-${alert.type}`" role="alert">{{ alert.message }}</div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h2 class="h4 fw-bold mb-4">Usuarios registrados</h2>

        <div v-if="loading" class="alert alert-info">Cargando usuarios...</div>
        <div v-else-if="users.length" class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.nombre }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-outline-dark btn-sm" type="button" @click="openEditModal(user)">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" type="button" @click="openDeleteModal(user)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-else title="Sin usuarios" message="Registra usuarios para validar login y administración." />
      </div>
    </div>

    <div v-if="showFormModal" class="modal fade show d-block" tabindex="-1" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5">{{ editingUser ? 'Editar usuario' : 'Crear usuario' }}</h2>
            <button class="btn-close" type="button" aria-label="Cerrar" @click="closeFormModal"></button>
          </div>
          <form @submit.prevent="saveUser">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="nombre">Nombre</label>
                  <input id="nombre" v-model.trim="form.nombre" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="username">Usuario</label>
                  <input id="username" v-model.trim="form.username" class="form-control" required />
                </div>
                <div class="col-12">
                  <label class="form-label" for="email">Correo</label>
                  <input id="email" v-model.trim="form.email" class="form-control" type="email" required />
                </div>
                <div class="col-12">
                  <label class="form-label" for="password">Contraseña</label>
                  <input
                    id="password"
                    v-model="form.password"
                    class="form-control"
                    minlength="6"
                    type="password"
                    :required="!editingUser"
                  />
                  <div class="form-text">
                    {{ editingUser ? 'Déjala vacía para conservar la contraseña actual.' : 'Mínimo 6 caracteres.' }}
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-secondary" type="button" @click="closeFormModal">Cancelar</button>
              <button class="btn btn-dark" type="submit">
                <i class="bi bi-check2-circle me-1"></i>
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="userToDelete" class="modal fade show d-block" tabindex="-1" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5">Confirmar eliminación</h2>
            <button class="btn-close" type="button" aria-label="Cerrar" @click="userToDelete = null"></button>
          </div>
          <div class="modal-body">
            ¿Eliminar el usuario <strong>{{ userToDelete.nombre }}</strong>?
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" type="button" @click="userToDelete = null">Cancelar</button>
            <button class="btn btn-danger" type="button" @click="removeUser">
              <i class="bi bi-trash me-1"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showFormModal || userToDelete" class="modal-backdrop fade show"></div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import { createUser, deleteUser, getUsers, updateUser } from '../services/userService'

const emptyForm = {
  nombre: '',
  username: '',
  email: '',
  password: '',
}

const users = ref([])
const editingUser = ref(null)
const userToDelete = ref(null)
const showFormModal = ref(false)
const loading = ref(true)
const alert = reactive({ type: 'success', message: '' })
const form = reactive({ ...emptyForm })

function showAlert(type, message) {
  alert.type = type
  alert.message = message
  window.setTimeout(() => {
    alert.message = ''
  }, 2600)
}

async function refreshUsers() {
  loading.value = true
  try {
    users.value = await getUsers()
  } catch (error) {
    showAlert('danger', error.message || 'No fue posible cargar los usuarios.')
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingUser.value = null
  Object.assign(form, emptyForm)
  showFormModal.value = true
}

function openEditModal(user) {
  editingUser.value = user
  Object.assign(form, { ...user, password: '' })
  showFormModal.value = true
}

function closeFormModal() {
  editingUser.value = null
  showFormModal.value = false
  Object.assign(form, emptyForm)
}

async function saveUser() {
  try {
    if (editingUser.value) {
      await updateUser(editingUser.value.id, form)
      showAlert('success', 'Usuario actualizado correctamente.')
    } else {
      await createUser(form)
      showAlert('success', 'Usuario creado correctamente.')
    }
    closeFormModal()
    await refreshUsers()
  } catch (error) {
    showAlert('danger', error.message || 'No fue posible guardar el usuario.')
  }
}

function openDeleteModal(user) {
  userToDelete.value = user
}

async function removeUser() {
  try {
    await deleteUser(userToDelete.value.id)
    userToDelete.value = null
    showAlert('success', 'Usuario eliminado correctamente.')
    await refreshUsers()
  } catch (error) {
    showAlert('danger', error.message || 'No fue posible eliminar el usuario.')
  }
}

onMounted(refreshUsers)
</script>
