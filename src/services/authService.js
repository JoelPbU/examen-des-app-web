const USERS_KEY = 'urbanstyle-users'
const CURRENT_USER_KEY = 'urbanstyle-current-user'

function isStoredUser(value) {
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.password === 'string'
  )
}

function isPublicUser(value) {
  return value && typeof value.id === 'string' && typeof value.name === 'string' && typeof value.email === 'string'
}

function readUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    return Array.isArray(users) ? users.filter(isStoredUser) : []
  } catch {
    localStorage.removeItem(USERS_KEY)
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

function createUserId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `u-${crypto.randomUUID()}`
  }

  return `u-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getUsers() {
  return readUsers().map(publicUser)
}

export function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null')
    return isPublicUser(user) ? user : null
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY)
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getCurrentUser())
}

export function registerUser({ name, email, password }) {
  const users = readUsers()
  const normalizedEmail = normalizeEmail(email)

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('Ya existe una cuenta registrada con este correo.')
  }

  if (password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.')
  }

  const user = {
    id: createUserId(),
    name: name.trim(),
    email: normalizedEmail,
    password,
  }

  writeUsers([...users, user])
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser(user)))
  return publicUser(user)
}

export function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email)
  const user = readUsers().find((item) => item.email === normalizedEmail && item.password === password)

  if (!user) {
    throw new Error('Correo o contraseña incorrectos.')
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser(user)))
  return publicUser(user)
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
}
