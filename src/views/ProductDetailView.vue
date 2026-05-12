<template>
  <section class="container py-5">
    <div v-if="product" class="row g-5 align-items-start">
      <div class="col-lg-6">
        <img :src="product.image" class="img-fluid rounded-4 shadow-sm detail-image" :alt="product.name" />
      </div>
      <div class="col-lg-6">
        <RouterLink class="text-secondary text-decoration-none" to="/catalogo">← Volver al catálogo</RouterLink>
        <span class="badge text-bg-dark d-inline-block mt-4 mb-3">{{ product.category }}</span>
        <h1 class="display-6 fw-bold">{{ product.name }}</h1>
        <p class="lead text-secondary">{{ product.description }}</p>
        <div class="d-flex align-items-center gap-4 my-4">
          <strong class="display-6">${{ product.price.toFixed(2) }}</strong>
          <span class="text-secondary">Stock disponible: {{ product.stock }}</span>
        </div>
        <button class="btn btn-dark btn-lg" type="button" :disabled="product.stock <= 0" @click="handleAddToCart">
          Añadir al carrito
        </button>
        <p v-if="message" class="alert alert-success mt-4 mb-0">{{ message }}</p>
      </div>
    </div>
    <EmptyState v-else title="Producto no encontrado" message="La prenda solicitada no existe o fue eliminada." />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import { addToCart } from '../services/cartService'
import { getProductById } from '../services/productService'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const product = ref(getProductById(props.id))
const message = ref('')

function handleAddToCart() {
  addToCart(product.value)
  message.value = `${product.value.name} añadido al carrito.`
}
</script>
