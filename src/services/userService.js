import { apiClient, hasMockApiConfig } from './apiService'

const STORAGE_KEY = 'urbanstyle-users'

const initialUsers = [
  {
    id: 'u-001',
    username: 'admin',
    password: 'admin123',
    nombre: 'Administrador UrbanStyle',
    email: 'admin@urbanstyle.com',
    role: "admin"
  },
]


function readLocalUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(users) ? users : []
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function writeLocalUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function createUserId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `u-${crypto.randomUUID()}`
  }

  return `u-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function normalizeUser(user) {
  return {
    id: String(user.id || ''),
    username: (user.username || user.email || '').trim(),
    password: user.password || '',
    nombre: (user.nombre || user.name || '').trim(),
    email: (user.email || '').trim().toLowerCase(),
    role: user.role || 'user',
  }
}

export function publicUser(user) {
  const normalized = normalizeUser(user)
  return {
    id: normalized.id,
    username: normalized.username,
    name: normalized.nombre,
    nombre: normalized.nombre,
    email: normalized.email,
    role: normalized.role,
  }
}

export function seedUsersIfEmpty() {
  if (!hasMockApiConfig() && readLocalUsers().length === 0) {
    writeLocalUsers(initialUsers)
  }
}

export async function getUsers() {
  if (hasMockApiConfig()) {
    const { data } = await apiClient.get('/usuarios')
    return data.map(normalizeUser)
  }

  seedUsersIfEmpty()
  return readLocalUsers().map(normalizeUser)
}

export async function createUser(user) {
  const normalized = normalizeUser(user)

  if (!normalized.username || !normalized.nombre || !normalized.email || !normalized.password) {
    throw new Error('Todos los campos del usuario son obligatorios.')
  }

  if (normalized.password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.')
  }

  if (hasMockApiConfig()) {
    const { data } = await apiClient.post('/usuarios', normalized)
    return normalizeUser(data)
  }

  const users = await getUsers()
  if (users.some((item) => item.email === normalized.email || item.username === normalized.username)) {
    throw new Error('Ya existe un usuario con ese correo o nombre de usuario.')
  }

  const newUser = { ...normalized, id: createUserId() }
  writeLocalUsers([newUser, ...users])
  return newUser
}

export async function updateUser(id, user) {
  const normalized = normalizeUser({ ...user, id })

  if (!normalized.username || !normalized.nombre || !normalized.email) {
    throw new Error('Nombre, usuario y correo son obligatorios.')
  }

  if (normalized.password && normalized.password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.')
  }

  if (hasMockApiConfig()) {
    const payload = normalized.password
      ? normalized
      : {
          id: normalized.id,
          username: normalized.username,
          nombre: normalized.nombre,
          email: normalized.email,
        }
    const { data } = await apiClient.put(`/usuarios/${id}`, payload)
    return normalizeUser(data)
  }

  const users = await getUsers()
  if (users.some((item) => item.id !== id && (item.email === normalized.email || item.username === normalized.username))) {
    throw new Error('Ya existe otro usuario con ese correo o nombre de usuario.')
  }

  const updatedUsers = users.map((item) =>
    item.id === id
      ? {
          ...item,
          ...normalized,
          password: normalized.password || item.password,
        }
      : item,
  )

  writeLocalUsers(updatedUsers)
  return updatedUsers.find((item) => item.id === id)
}

export async function deleteUser(id) {
  if (hasMockApiConfig()) {
    await apiClient.delete(`/usuarios/${id}`)
    return
  }

  writeLocalUsers((await getUsers()).filter((user) => user.id !== id))
}
