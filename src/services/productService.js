import { apiClient, hasMockApiConfig } from './apiService'

const STORAGE_KEY = 'urbanstyle-products'

const initialProducts = [
  {
    id: 'p-001',
    nombre: 'Chaqueta bomber negra',
    categoria: 'Chaquetas',
    precio: 79.99,
    stock: 12,
    imagen: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
    descripcion: 'Chaqueta bomber urbana con corte moderno, ideal para looks casuales de noche.',
  },
  {
    id: 'p-002',
    nombre: 'Sudadera oversized beige',
    categoria: 'Sudaderas',
    precio: 49.99,
    stock: 18,
    imagen: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=80',
    descripcion: 'Sudadera cómoda de algodón suave con silueta oversized y estilo streetwear.',
  },
  {
    id: 'p-003',
    nombre: 'Jeans rectos vintage',
    categoria: 'Pantalones',
    precio: 59.99,
    stock: 10,
    imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
    descripcion: 'Jeans de tiro medio con lavado vintage y corte recto para uso diario.',
  },
  {
    id: 'p-004',
    nombre: 'Camiseta graphic white',
    categoria: 'Camisetas',
    precio: 24.99,
    stock: 25,
    imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    descripcion: 'Camiseta blanca con print urbano, cuello redondo y tela transpirable.',
  },
]

function readProducts() {
  try {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(products) ? products : []
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function writeProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

function createProductId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `p-${crypto.randomUUID()}`
  }

  return `p-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function normalizeProduct(product) {
  const price = Number(product.price ?? product.precio)
  const stock = Number(product.stock ?? 0)

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('El precio debe ser un número válido mayor o igual a cero.')
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('El stock debe ser un número entero mayor o igual a cero.')
  }

  return {
    id: String(product.id || ''),
    name: product.name || product.nombre || '',
    nombre: product.name || product.nombre || '',
    category: product.category || product.categoria || '',
    categoria: product.category || product.categoria || '',
    price,
    precio: price,
    stock,
    image: product.image || product.imagen || '',
    imagen: product.image || product.imagen || '',
    description: product.description || product.descripcion || '',
    descripcion: product.description || product.descripcion || '',
  }
}

function productPayload(product) {
  const normalized = normalizeProduct(product)

  if (!normalized.nombre || !normalized.categoria || !normalized.descripcion || !normalized.imagen) {
    throw new Error('Todos los campos del producto son obligatorios.')
  }

  return {
    nombre: normalized.nombre,
    descripcion: normalized.descripcion,
    precio: normalized.precio,
    categoria: normalized.categoria,
    stock: normalized.stock,
    imagen: normalized.imagen,
  }
}

export function seedProductsIfEmpty() {
  if (!hasMockApiConfig() && readProducts().length === 0) {
    writeProducts(initialProducts)
  }
}

export async function getProducts() {
  if (hasMockApiConfig()) {
    const { data } = await apiClient.get('/productos')
    return data.map(normalizeProduct)
  }

  seedProductsIfEmpty()
  return readProducts().map(normalizeProduct)
}

export async function getProductById(id) {
  if (hasMockApiConfig()) {
    const { data } = await apiClient.get(`/productos/${id}`)
    return normalizeProduct(data)
  }

  return (await getProducts()).find((product) => product.id === id) || null
}

export async function createProduct(product) {
  const payload = productPayload(product)

  if (hasMockApiConfig()) {
    const { data } = await apiClient.post('/productos', payload)
    return normalizeProduct(data)
  }

  const products = await getProducts()
  const newProduct = normalizeProduct({ ...payload, id: createProductId() })
  writeProducts([newProduct, ...products])
  return newProduct
}

export async function updateProduct(id, product) {
  const payload = productPayload(product)

  if (hasMockApiConfig()) {
    const { data } = await apiClient.put(`/productos/${id}`, payload)
    return normalizeProduct(data)
  }

  const products = (await getProducts()).map((item) => (item.id === id ? normalizeProduct({ ...item, ...payload, id }) : item))
  writeProducts(products)
  return products.find((item) => item.id === id)
}

export async function deleteProduct(id) {
  if (hasMockApiConfig()) {
    await apiClient.delete(`/productos/${id}`)
    return
  }

  writeProducts((await getProducts()).filter((product) => product.id !== id))
}
