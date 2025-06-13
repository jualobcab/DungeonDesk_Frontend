<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { onMounted } from 'vue'

  const authStore = useAuthStore()

  onMounted(async () => {
    try {
      await authStore.initializeAuth()
    } catch (error) {
      console.error('Auth initialization failed:', error)
    }
  })
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
    <header class="bg-gray-900 border-b border-amber-900/30 shadow-lg">
      <div class="container mx-auto px-4 py-4 flex items-center relative">
        <!-- Primer div: 50% ancho, icono grande a la izquierda, título grande a la derecha -->
        <div class="flex items-center w-1/2">
          <img src="/logoDungeonDesk.ico" alt="DungeonDesk Logo" class="h-12 w-12" />
          <h1 class="ml-auto text-4xl font-medieval text-amber-500">Dungeon Desk</h1>
        </div>
        <!-- Segundo div: 50% ancho, botones alineados a la derecha -->
        <div class="flex items-center justify-end w-1/2 space-x-4">
          <template v-if="authStore.user && !authStore.isAuthLoading">
            <span class="text-amber-400 text-lg">Welcome, {{ authStore.user.username }}</span>
            <RouterLink to="/" class="px-4 py-2 bg-red-900 hover:bg-red-800 rounded-lg text-gray-200 transition-colors duration-200 text-lg" @click.prevent="authStore.logout">Logout</RouterLink>
          </template>
          <template v-else-if="!authStore.user && !authStore.isAuthLoading">
            <RouterLink to="/login" class="px-4 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg text-gray-200 transition-colors duration-200 text-lg">Login</RouterLink>
          </template>
          <template v-else>
            <span class="text-amber-500/80 animate-pulse text-lg">Loading ...</span>
          </template>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      <nav class="md:w-64 md:space-y-2 md:flex-col flex-row md:space-x-0 space-x-4">
        <RouterLink 
          v-for="(link, index) in [
            { to: '/equipment', text: 'Equipment', icon: '🗡️' },
            { to: '/classes', text: 'Classes', icon: '📚' },
            ...((!authStore.isAuthLoading && authStore.user) ? [
              { to: '/characters', text: 'Characters', icon: '🧙‍♂️' },
              { to: '/campaigns', text: 'Campaigns', icon: '🏰' },
              ...(!!authStore.user?.is_admin ? [
                { to: '/features', text: 'Features', icon: '✨' }
              ] : [])
            ] : [])
          ]" 
          :key="index"
          :to="link.to" 
          class="block px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-amber-900/20 
                transition-colors duration-200 text-amber-500 hover:text-amber-400"
        >
          <span class="flex items-center gap-2">
            <span>{{ link.icon }}</span>
            <span>{{ link.text }}</span>
          </span>
        </RouterLink>
      </nav>

      <main class="flex-1 bg-gray-800 rounded-lg border border-amber-900/20 p-6">
        <RouterView v-if="!authStore.isAuthLoading" class="h-full"/>
        <div v-else class="h-full flex items-center justify-center">
          <div class="text-amber-500/80 animate-pulse text-lg">
            Loading your adventure...
          </div>
        </div>
      </main>
    </div>
  </div>
</template>