<template>
  <section class="container py-5">
    <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
      <div>
        <span class="text-uppercase text-secondary small fw-bold">Administración</span>
        <h1 class="fw-bold mb-0">CRUD de productos</h1>
      </div>
      <button class="btn btn-dark align-self-start" type="button" @click="openCreateModal">
        <i class="bi bi-plus-lg me-1"></i>
        Crear producto
      </button>
    </div>

    <div v-if="alert.message" :class="`alert alert-${alert.type}`" role="alert">{{ alert.message }}</div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <h2 class="h4 fw-bold mb-0">Productos registrados</h2>
          <RouterLink class="btn btn-outline-dark btn-sm align-self-start" to="/catalogo">Ver catálogo</RouterLink>
        </div>

        <div v-if="loading" class="alert alert-info">Cargando productos...</div>
        <div v-else-if="products.length" class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <img :src="product.image" class="admin-thumb" :alt="product.name" />
                    <strong>{{ product.name }}</strong>
                  </div>
                </td>
                <td>{{ product.category }}</td>
                <td>${{ product.price.toFixed(2) }}</td>
                <td>{{ product.stock }}</td>
                <td>
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-outline-dark btn-sm" type="button" @click="openEditModal(product)">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" type="button" @click="openDeleteModal(product)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-else title="Sin productos" message="Crea tu primer producto para mostrarlo en la tienda." />
      </div>
    </div>

    <div v-if="showFormModal" class="modal fade show d-block" tabindex="-1" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5">{{ editingProduct ? 'Editar producto' : 'Crear producto' }}</h2>
            <button class="btn-close" type="button" aria-label="Cerrar" @click="closeFormModal"></button>
          </div>
          <div class="modal-body">
            <ProductForm :product="editingProduct" @save="saveProduct" @cancel="closeFormModal" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="productToDelete" class="modal fade show d-block" tabindex="-1" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5">Confirmar eliminación</h2>
            <button class="btn-close" type="button" aria-label="Cerrar" @click="productToDelete = null"></button>
          </div>
          <div class="modal-body">
            ¿Eliminar el producto <strong>{{ productToDelete.name }}</strong>?
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" type="button" @click="productToDelete = null">Cancelar</button>
            <button class="btn btn-danger" type="button" @click="removeProduct">
              <i class="bi bi-trash me-1"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showFormModal || productToDelete" class="modal-backdrop fade show"></div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import ProductForm from '../components/ProductForm.vue'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/productService'

const products = ref([])
const editingProduct = ref(null)
const productToDelete = ref(null)
const showFormModal = ref(false)
const loading = ref(true)
const alert = reactive({ type: 'success', message: '' })

function showAlert(type, message) {
  alert.type = type
  alert.message = message
  window.setTimeout(() => {
    alert.message = ''
  }, 2600)
}

async function refreshProducts() {
  loading.value = true
  try {
    products.value = await getProducts()
  } catch (error) {
    showAlert('danger', error.message || 'No fue posible cargar los productos.')
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingProduct.value = null
  showFormModal.value = true
}

function openEditModal(product) {
  editingProduct.value = { ...product }
  showFormModal.value = true
}

function closeFormModal() {
  editingProduct.value = null
  showFormModal.value = false
}

async function saveProduct(product) {
  try {
    if (editingProduct.value) {
      await updateProduct(editingProduct.value.id, product)
      showAlert('success', 'Producto actualizado correctamente.')
    } else {
      await createProduct(product)
      showAlert('success', 'Producto creado correctamente.')
    }
    closeFormModal()
    await refreshProducts()
  } catch (error) {
    showAlert('danger', error.message || 'No fue posible guardar el producto.')
  }
}

function openDeleteModal(product) {
  productToDelete.value = product
}

async function removeProduct() {
  try {
    await deleteProduct(productToDelete.value.id)
    productToDelete.value = null
    showAlert('success', 'Producto eliminado correctamente.')
    await refreshProducts()
  } catch (error) {
    showAlert('danger', error.message || 'No fue posible eliminar el producto.')
  }
}

onMounted(refreshProducts)
</script>
