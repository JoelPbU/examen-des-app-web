<template>
  <div class="card product-card h-100 border-0 shadow-sm">
    <img :src="product.image" class="card-img-top product-image" :alt="product.name" />
    <div class="card-body d-flex flex-column">
      <span class="badge text-bg-light align-self-start mb-2">{{ product.category }}</span>
      <h3 class="h5 card-title">{{ product.name }}</h3>
      <p class="card-text text-secondary flex-grow-1">{{ product.description }}</p>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <strong class="fs-5">${{ product.price.toFixed(2) }}</strong>
        <span class="small text-secondary">Stock: {{ product.stock }}</span>
      </div>
      <div class="d-grid gap-2 d-sm-flex">
        <RouterLink class="btn btn-outline-dark flex-fill" :to="`/producto/${product.id}`">Ver detalle</RouterLink>
        <button class="btn btn-dark flex-fill" type="button" :disabled="product.stock <= 0" @click="$emit('add-to-cart', product)">
          Añadir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
})

defineEmits(['add-to-cart'])
</script>
