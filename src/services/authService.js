import api from './api'

export default {
  login(credentials) {
    return api.post('/login', credentials)
  },
  logout() {
    return api.post('/logout')
  },
  register(credentials) {
    return api.post('/register', credentials)
  }
}