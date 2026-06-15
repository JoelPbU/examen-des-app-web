import { createUser, getUsers, publicUser, seedUsersIfEmpty } from './userService'

const CURRENT_USER_KEY = 'urbanstyle-current-user'
const TOKEN_KEY = 'urbanstyle-auth-token'

function createToken(user) {
  return `token-${user.id}-${Date.now()}`
}

export function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null')
    return user && user.id && user.email ? user : null
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY)
    return null
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return Boolean(getCurrentUser() && getAuthToken())
}

export function isAdmin() {
  const user = getCurrentUser()
  return Boolean(user && user.role === 'admin')
}

export async function registerUser({ name, username, email, password }) {
  seedUsersIfEmpty()
  const user = await createUser({
    nombre: name,
    username: username || email,
    email,
    password,
  })
  const safeUser = publicUser(user)
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser))
  localStorage.setItem(TOKEN_KEY, createToken(safeUser))
  return safeUser
}

export async function loginUser({ username, email, password }) {
  seedUsersIfEmpty()
  const access = (username || email || '').trim().toLowerCase()
  const user = (await getUsers()).find(
    (item) => (item.email === access || item.username.toLowerCase() === access) && item.password === password,
  )

  if (!user) {
    throw new Error('Usuario o contraseña incorrectos.')
  }

  const safeUser = publicUser(user)
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser))
  localStorage.setItem(TOKEN_KEY, createToken(safeUser))
  return safeUser
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
}
