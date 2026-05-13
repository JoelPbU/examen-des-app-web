<template>
  <div class="card border-0 shadow-sm mb-3">
    <div class="row g-0 align-items-center">
      <div class="col-4 col-md-2">
        <img :src="item.image" class="img-fluid rounded-start cart-image" :alt="item.name" />
      </div>
      <div class="col-8 col-md-10">
        <div class="card-body">
          <div class="row align-items-center g-3">
            <div class="col-md-5">
              <h3 class="h6 fw-bold mb-1">{{ item.name }}</h3>
              <p class="mb-0 text-secondary">${{ item.price.toFixed(2) }} c/u</p>
            </div>
            <div class="col-md-3">
              <label class="form-label small" :for="`quantity-${item.id}`">Cantidad</label>
              <input
                :id="`quantity-${item.id}`"
                class="form-control form-control-sm"
                min="1"
                type="number"
                :value="item.quantity"
                @input="$emit('update-quantity', item.id, $event.target.value)"
              />
            </div>
            <div class="col-md-2 fw-bold">${{ (item.price * item.quantity).toFixed(2) }}</div>
            <div class="col-md-2 text-md-end">
              <button class="btn btn-outline-danger btn-sm" type="button" @click="$emit('remove', item.id)">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(['update-quantity', 'remove'])
</script>
