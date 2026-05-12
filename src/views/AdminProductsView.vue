<template>
  <section class="container py-5">
    <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
      <div>
        <span class="text-uppercase text-secondary small fw-bold">Administración</span>
        <h1 class="fw-bold mb-0">CRUD de productos</h1>
      </div>
      <RouterLink class="btn btn-outline-dark align-self-start" to="/catalogo">Ver catálogo</RouterLink>
    </div>

    <div class="row g-4">
      <div class="col-lg-5">
        <ProductForm :product="editingProduct" @save="saveProduct" @cancel="editingProduct = null" />
      </div>
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h2 class="h4 fw-bold mb-4">Productos registrados</h2>
            <div v-if="products.length" class="table-responsive">
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
                        <button class="btn btn-outline-dark btn-sm" type="button" @click="editProduct(product)">Editar</button>
                        <button class="btn btn-outline-danger btn-sm" type="button" @click="removeProduct(product.id)">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <EmptyState v-else title="Sin productos" message="Crea tu primer producto para mostrarlo en la tienda." />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import ProductForm from '../components/ProductForm.vue'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/productService'

const products = ref(getProducts())
const editingProduct = ref(null)

function refreshProducts() {
  products.value = getProducts()
}

function saveProduct(product) {
  if (editingProduct.value) {
    updateProduct(editingProduct.value.id, product)
    editingProduct.value = null
  } else {
    createProduct(product)
  }
  refreshProducts()
}

function editProduct(product) {
  editingProduct.value = { ...product }
}

function removeProduct(id) {
  if (window.confirm('¿Eliminar este producto de UrbanStyle?')) {
    deleteProduct(id)
    refreshProducts()
    if (editingProduct.value?.id === id) {
      editingProduct.value = null
    }
  }
}
</script>
