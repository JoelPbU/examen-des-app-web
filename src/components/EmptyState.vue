<template>
  <div class="text-center py-5 px-3 bg-light rounded-4">
    <h2 class="h4 fw-bold">{{ title }}</h2>
    <p class="text-secondary mb-0">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'No hay resultados',
  },
  message: {
    type: String,
    default: 'Intenta cambiar los filtros o vuelve más tarde.',
  },
})
</script>
