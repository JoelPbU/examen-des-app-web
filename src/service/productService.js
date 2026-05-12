const STORAGE_KEY = 'urbanstyle-products'

const initialProducts = [
  {
    id: 'p-001',
    name: 'Chaqueta bomber negra',
    category: 'Chaquetas',
    price: 79.99,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
    description: 'Chaqueta bomber urbana con corte moderno, ideal para looks casuales de noche.',
  },
  {
    id: 'p-002',
    name: 'Sudadera oversized beige',
    category: 'Sudaderas',
    price: 49.99,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=80',
    description: 'Sudadera cómoda de algodón suave con silueta oversized y estilo streetwear.',
  },
  {
    id: 'p-003',
    name: 'Jeans rectos vintage',
    category: 'Pantalones',
    price: 59.99,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
    description: 'Jeans de tiro medio con lavado vintage y corte recto para uso diario.',
  },
  {
    id: 'p-004',
    name: 'Camiseta graphic white',
    category: 'Camisetas',
    price: 24.99,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    description: 'Camiseta blanca con print urbano, cuello redondo y tela transpirable.',
  },
  {
    id: 'p-005',
    name: 'Vestido midi urbano',
    category: 'Vestidos',
    price: 64.99,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80',
    description: 'Vestido midi versátil con líneas limpias para un estilo urbano elegante.',
  },
  {
    id: 'p-006',
    name: 'Zapatillas urban runner',
    category: 'Calzado',
    price: 89.99,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'Zapatillas ligeras con diseño contemporáneo para combinar comodidad y estilo.',
  },
]

function readProducts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
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

function normalizeProduct(product) {
  const price = Number(product.price)
  const stock = Number(product.stock)

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('El precio debe ser un número válido mayor o igual a cero.')
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('El stock debe ser un número entero mayor o igual a cero.')
  }

  return {
    ...product,
    price,
    stock,
  }
}

export function seedProductsIfEmpty() {
  if (readProducts().length === 0) {
    writeProducts(initialProducts)
  }
}

export function getProducts() {
  return readProducts()
}

export function getProductById(id) {
  return readProducts().find((product) => product.id === id)
}

export function createProduct(product) {
  const products = readProducts()
  const newProduct = {
    ...normalizeProduct(product),
    id: createProductId(),
  }

  writeProducts([newProduct, ...products])
  return newProduct
}

export function updateProduct(id, product) {
  const normalizedProduct = normalizeProduct(product)
  const products = readProducts().map((item) =>
    item.id === id
      ? {
          ...item,
          ...normalizedProduct,
        }
      : item,
  )

  writeProducts(products)
  return getProductById(id)
}

export function deleteProduct(id) {
  writeProducts(readProducts().filter((product) => product.id !== id))
}
