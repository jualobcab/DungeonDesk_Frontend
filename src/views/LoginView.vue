<template>
  <div class="flex items-center justify-center flex-1 min-h-0">
    <form
      @submit.prevent="handleLogin"
      class="bg-gray-900 shadow-lg rounded-lg p-6 w-full max-w-xs border border-amber-900/30"
    >
      <h2 class="text-2xl font-medieval font-bold mb-5 text-center text-amber-500">Login</h2>
      <div class="mb-3">
        <label for="email" class="block text-amber-400 mb-1">Email</label>
        <input
          type="email"
          id="email"
          v-model="credentials.email"
          required
          class="w-full px-3 py-2 border border-amber-900/30 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-amber-400 mb-1">Password</label>
        <input
          type="password"
          id="password"
          v-model="credentials.password"
          required
          class="w-full px-3 py-2 border border-amber-900/30 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-amber-700 hover:bg-amber-600 text-gray-900 font-semibold py-2 rounded transition duration-200 font-medieval"
      >
        Login
      </button>
      <div class="mt-6 text-center text-sm text-amber-400">
        You don't have an account?
        <router-link to="/register"
          class="ml-1 text-amber-500 hover:text-amber-300 underline transition-colors duration-150"
        >
          Register here
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const credentials = ref({
  email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    await authStore.login(credentials.value)
    router.push('/').then(() => window.location.reload())
  } catch (error) {
    console.error('Login failed:', error)
    // Optionally show an error message to the user
  }
}
</script>