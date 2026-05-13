<template>
  <section class="container py-5">
    <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
      <div>
        <span class="text-uppercase text-secondary small fw-bold">Compra</span>
        <h1 class="fw-bold mb-0">Carrito de compras</h1>
      </div>
      <RouterLink class="btn btn-outline-dark align-self-start" to="/catalogo">Seguir comprando</RouterLink>
    </div>

    <div v-if="items.length" class="row g-4">
      <div class="col-lg-8">
        <CartItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          @update-quantity="changeQuantity"
          @remove="removeItem"
        />
      </div>
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm sticky-lg-top cart-summary">
          <div class="card-body">
            <h2 class="h4 fw-bold mb-3">Resumen</h2>
            <div class="d-flex justify-content-between text-secondary mb-2">
              <span>Productos</span>
              <span>{{ totalItems }}</span>
            </div>
            <div class="d-flex justify-content-between fs-4 fw-bold border-top pt-3 mt-3">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
            <button class="btn btn-dark w-100 mt-4" type="button" @click="checkout">Finalizar compra</button>
            <button class="btn btn-outline-secondary w-100 mt-2" type="button" @click="emptyCart">Vaciar carrito</button>
            <p v-if="message" class="alert alert-success mt-3 mb-0">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
    <EmptyState v-else title="Tu carrito está vacío" message="Añade prendas desde el catálogo para comenzar tu compra." />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import CartItem from '../components/CartItem.vue'
import EmptyState from '../components/EmptyState.vue'
import { clearCart, getCartItems, removeFromCart, updateCartQuantity } from '../services/cartService'

const items = ref(getCartItems())
const message = ref('')
const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

function changeQuantity(id, quantity) {
  items.value = updateCartQuantity(id, quantity)
}

function removeItem(id) {
  items.value = removeFromCart(id)
}

function emptyCart() {
  clearCart()
  items.value = []
}

function checkout() {
  message.value = 'Compra simulada completada. Gracias por elegir UrbanStyle.'
  clearCart()
  items.value = []
}
</script>
