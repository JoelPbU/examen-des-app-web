<template>
  <form @submit.prevent="submitForm">
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label" for="name">Nombre</label>
        <input id="name" v-model.trim="form.name" class="form-control" required />
      </div>
      <div class="col-md-6">
        <label class="form-label" for="category">Categoría</label>
        <input id="category" v-model.trim="form.category" class="form-control" required />
      </div>
      <div class="col-md-4">
        <label class="form-label" for="price">Precio</label>
        <input id="price" v-model.number="form.price" class="form-control" min="0" step="0.01" type="number" required />
      </div>
      <div class="col-md-4">
        <label class="form-label" for="stock">Stock</label>
        <input id="stock" v-model.number="form.stock" class="form-control" min="0" step="1" type="number" required />
      </div>
      <div class="col-md-4">
        <label class="form-label" for="image">Imagen URL</label>
        <input id="image" v-model.trim="form.image" class="form-control" type="url" required />
      </div>
      <div class="col-12">
        <label class="form-label" for="description">Descripción</label>
        <textarea id="description" v-model.trim="form.description" class="form-control" rows="3" required></textarea>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2 mt-4">
      <button class="btn btn-outline-secondary" type="button" @click="cancelEdit">Cancelar</button>
      <button class="btn btn-dark" type="submit">
        <i class="bi bi-check2-circle me-1"></i>
        {{ isEditing ? 'Guardar cambios' : 'Crear producto' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['save', 'cancel'])

const emptyForm = {
  name: '',
  category: '',
  price: 0,
  stock: 0,
  image: '',
  description: '',
}

const form = reactive({ ...emptyForm })
const isEditing = computed(() => Boolean(props.product))

watch(
  () => props.product,
  (product) => {
    Object.assign(form, product || emptyForm)
  },
  { immediate: true },
)

function submitForm() {
  emit('save', { ...form })
  if (!isEditing.value) {
    Object.assign(form, emptyForm)
  }
}

function cancelEdit() {
  Object.assign(form, emptyForm)
  emit('cancel')
}
</script>
