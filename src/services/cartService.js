const STORAGE_KEY = 'urbanstyle-cart'

function readCart() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

function writeCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getCartItems() {
  return readCart()
}

export function addToCart(product) {
  const items = readCart()
  const existing = items.find((item) => item.id === product.id)

  if (existing) {
    existing.quantity += 1
    writeCart(items)
    return items
  }

  writeCart([
    ...items,
    {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
    },
  ])

  return readCart()
}

export function updateCartQuantity(id, quantity) {
  const nextQuantity = Number(quantity)
  const items = readCart()
    .map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item))
    .filter((item) => item.quantity > 0)

  writeCart(items)
  return items
}

export function removeFromCart(id) {
  const items = readCart().filter((item) => item.id !== id)
  writeCart(items)
  return items
}

export function clearCart() {
  writeCart([])
}

export function getCartTotal() {
  return readCart().reduce((total, item) => total + item.price * item.quantity, 0)
}
