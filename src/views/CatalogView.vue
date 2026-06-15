<template>
  <section class="container py-5">
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
      <div>
        <span class="text-uppercase text-secondary small fw-bold">Catálogo</span>
        <h1 class="fw-bold mb-0">Explora UrbanStyle</h1>
      </div>
      <div class="row g-2 catalog-controls">
        <div class="col-sm-7">
          <input v-model.trim="search" class="form-control" placeholder="Buscar producto" type="search" />
        </div>
        <div class="col-sm-5">
          <select v-model="selectedCategory" class="form-select">
            <option value="">Todas</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="alert alert-info">Cargando catálogo...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="filteredProducts.length" class="row g-4">
      <div v-for="product in filteredProducts" :key="product.id" class="col-sm-6 col-lg-4">
        <ProductCard :product="product" @add-to-cart="handleAddToCart" />
      </div>
    </div>
    <EmptyState v-else title="Sin productos" message="No encontramos prendas con esos filtros." />

    <div v-if="message" class="toast-message alert alert-success shadow-sm">{{ message }}</div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import ProductCard from '../components/ProductCard.vue'
import { addToCart } from '../services/cartService'
import { getProducts } from '../services/productService'

const products = ref([])
const search = ref('')
const selectedCategory = ref('')
const message = ref('')
const loading = ref(true)
const error = ref('')

const categories = computed(() => [...new Set(products.value.map((product) => product.category))])
const filteredProducts = computed(() => {
  const query = search.value.toLowerCase()
  return products.value.filter((product) => {
    const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(query)
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

function handleAddToCart(product) {
  addToCart(product)
  message.value = `${product.name} añadido al carrito.`
  window.setTimeout(() => {
    message.value = ''
  }, 2200)
}

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    products.value = await getProducts()
  } catch (err) {
    error.value = err.message || 'No fue posible cargar el catálogo.'
  } finally {
    loading.value = false
  }
}

onMounted(loadProducts)
</script>
