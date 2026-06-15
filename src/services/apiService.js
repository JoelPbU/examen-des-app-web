import axios from 'axios'

const baseURL = 'https://6a0e468e1736097c3609a645.mockapi.io/'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
})

export function hasMockApiConfig() {
  
  return Boolean(baseURL)
}
