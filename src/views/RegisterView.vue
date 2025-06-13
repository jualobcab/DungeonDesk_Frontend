<template>
  <div class="flex items-center justify-center flex-1 min-h-0">
    <form @submit.prevent="handleRegister" class="bg-gray-900 shadow-lg rounded-lg p-6 w-full max-w-xs border border-amber-900/30">
      <h2 class="text-2xl font-medieval font-bold mb-5 text-center text-amber-500">Register</h2>
      <div class="mb-3">
        <label for="username" class="block text-amber-400 mb-1">Username</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          required
          class="w-full px-3 py-2 border border-amber-900/30 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div class="mb-3">
        <label for="email" class="block text-amber-400 mb-1">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          required
          class="w-full px-3 py-2 border border-amber-900/30 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-amber-400 mb-1">Password</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
          class="w-full px-3 py-2 border border-amber-900/30 rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div v-if="Object.keys(errors).length > 0" class="mb-4 text-red-400 text-sm">
        <ul>
          <li v-for="(errorList, field) in errors" :key="field">
            <template v-for="(error, index) in errorList" :key="index">
              {{ error }}
            </template>
          </li>
        </ul>
      </div>

      <div class="mt-6 text-center text-sm text-amber-400">
        Already have an account?
        <router-link to="/login" class="ml-1 text-amber-500 hover:text-amber-300 underline transition-colors duration-150">
          Login here
        </router-link>
      </div>

      <button
        type="submit"
        class="w-full bg-amber-700 hover:bg-amber-600 text-gray-900 font-semibold py-2 rounded transition duration-200 font-medieval mt-4"
        :disabled="isLoading"
      >
        Register
      </button>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()
  const form = ref({
    username: '',
    email: '',
    password: '',
  })
  const errors = ref({})
  const isLoading = ref(false)

  const handleRegister = async () => {
    errors.value = {}
    isLoading.value = true

    try {
      const response = await authStore.register(form.value)
      console.log('Registration response:', response)

      if (response.data?.data?.token) {
        authStore.setAuth(response.data.data.token, response.data.data.user)
        router.push('/').then(() => window.location.reload())
      } else if (response.data?.token) {
        authStore.setAuth(response.data.token, response.data.user)
        router.push('/').then(() => window.location.reload())
      } else {
        errors.value = { general: ['Registration succesful but login failed, please try again.'] }
        router.push('/login')
      }
    } catch (err) {
      console.error('Registration error:', err.response)

      if (err.response?.data?.errors) {
        errors.value = err.response.data.errors
      } else if (err.response?.status === 422) {
        errors.value = {
          general: ['Please check your input and try again']
        }
      } else if (err.response?.status === 409) {
        errors.value = {
          user_email: ['This email is already registered']
        }
      } else {
        errors.value = {
          general: [
            err.response?.data?.message ||
            err.message ||
            'Registration failed. Please try again.'
          ]
        }
      }
    } finally {
      isLoading.value = false
    }
  }
</script>