<template>
  <div>
    <div class="flex items-center justify-center mb-8 relative">
      <h1 class="text-3xl font-medieval text-amber-500 text-center w-full">Artifacts</h1>
      <div
        v-if="authStore.user && authStore.user.is_admin"
        class="absolute right-0"
      >
        <RouterLink
          to="/equipment/create"
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition ml-4"
        >
          New Artifact
        </RouterLink>
      </div>
    </div>
    <!-- Botones de navegación -->
    <div class="flex justify-center gap-4 mb-8">
      <RouterLink
        v-for="btn in buttons"
        :key="btn.name"
        :to="btn.to"
        class="px-5 py-2 rounded-lg font-medieval text-lg border border-amber-900/40 bg-amber-800 text-gray-100 hover:bg-amber-700 hover:text-gray-900 transition-colors duration-200"
        active-class="bg-amber-700 text-gray-900"
      >
        {{ btn.label }}
      </RouterLink>
    </div>

    <!-- Listado de Artifacts -->
    <div class="bg-gray-900 border border-amber-900/30 rounded-lg p-4 max-w-2xl mx-auto">
      <ul>
        <li
          v-for="item in paginatedArtifacts"
          :key="item.artifact_id"
          class="relative flex items-center gap-4 py-3 border-b border-amber-900/10 last:border-b-0 hover:bg-gray-800 rounded transition"
        >
          <!-- Botones admin por item -->
          <div
            v-if="authStore.user && authStore.user.is_admin"
            class="absolute top-2 right-2 flex gap-2 z-10"
          >
            <!-- Editar -->
            <button
              class="bg-green-700 hover:bg-green-600 text-white rounded-full p-2 transition"
              @click.stop="editArtifact(item)"
              title="Editar artifact"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
              </svg>
            </button>
            <!-- Borrar -->
            <button
              class="bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-2 transition"
              @click.stop="openDeleteModal(item)"
              title="Borrar artifact"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <RouterLink
            :to="`/equipment/artifacts/${item.artifact_id}`"
            class="flex items-center gap-4 flex-1 min-w-0"
          >
            <img
              :src="getArtifactIcon(item.type)"
              :alt="item.type"
              class="w-12 h-12 object-contain rounded bg-gray-800 border border-amber-900/30"
              @error="onImgError"
            />
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-bold text-amber-400 font-medieval truncate">{{ item.name }}</h2>
              <div class="text-xs mb-1">
                <span class="font-semibold text-amber-300">Type:</span>
                <span class="ml-1 text-gray-200">{{ item.type }}</span>
              </div>
              <div class="text-xs mb-1">
                Rarity:
                <span :class="rarityClass(item.rarity)" class="font-semibold">
                  {{ item.rarity }}
                </span>
              </div>
              <p class="text-gray-200 text-sm truncate">{{ item.description }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>

      <!-- Paginación -->
      <div class="flex justify-center mt-6 gap-2">
        <button
          class="px-3 py-1 rounded bg-gray-800 border border-amber-900/30 text-amber-400 hover:bg-amber-700 hover:text-gray-900 transition"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Prev
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 rounded border transition',
            currentPage === page
              ? 'bg-amber-700 text-gray-900 border-amber-700 font-bold'
              : 'bg-gray-800 text-amber-400 border-amber-900/30 hover:bg-amber-700 hover:text-gray-900'
          ]"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1 rounded bg-gray-800 border border-amber-900/30 text-amber-400 hover:bg-amber-700 hover:text-gray-900 transition"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal de confirmación de borrado -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-sm w-full shadow-xl flex flex-col items-center">
        <p class="text-lg text-gray-100 mb-6 text-center">
          ¿Seguro que quieres borrar el artifact <span class="text-amber-400 font-bold">{{ artifactToDelete?.name }}</span>?
        </p>
        <div class="flex gap-4">
          <button
            class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold"
            @click="confirmDelete"
          >
            Sí, borrar
          </button>
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
            @click="showDeleteModal = false"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { equipmentService, adminService } from '@/services/api'
  import { RouterLink, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const router = useRouter()

  const buttons = [
    { name: 'armors', label: 'Armors', to: '/equipment/armors' },
    { name: 'weapons', label: 'Weapons', to: '/equipment/weapons' },
    { name: 'artifacts', label: 'Artifacts', to: '/equipment/artifacts' }
  ]

  const artifacts = ref([])
  const currentPage = ref(1)
  const pageSize = 10

  const showDeleteModal = ref(false)
  const artifactToDelete = ref(null)

  const rarityClass = (rarity) => {
    switch ((rarity || '').toLowerCase()) {
      case 'common':
        return 'text-gray-300'
      case 'uncommon':
        return 'text-green-400'
      case 'rare':
        return 'text-blue-400'
      case 'very rare':
        return 'text-purple-400'
      case 'legendary':
        return 'text-yellow-400'
      case 'artifact':
        return 'text-amber-500'
      default:
        return 'text-gray-200'
    }
  }

  const getArtifactIcon = (type) => {
    if (!type) return new URL('../assets/img/equipmentIcons/default.jpg', import.meta.url).href
    const fileName = type.toLowerCase().replace(/\s+/g, '-')
    return new URL(`../assets/img/equipmentIcons/${fileName}.jpg`, import.meta.url).href
  }

  const onImgError = (event) => {
    event.target.src = new URL('../assets/img/equipmentIcons/default.jpg', import.meta.url).href
  }

  // Ordenar alfabéticamente por name
  const sortedArtifacts = computed(() =>
    [...artifacts.value].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  )

  const totalPages = computed(() => Math.ceil(sortedArtifacts.value.length / pageSize))

  const paginatedArtifacts = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return sortedArtifacts.value.slice(start, start + pageSize)
  })

  const openDeleteModal = (item) => {
    artifactToDelete.value = item
    showDeleteModal.value = true
  }

  const confirmDelete = async () => {
    if (!artifactToDelete.value) return
    try {
      await adminService.deleteArtifact(artifactToDelete.value.artifact_id)
      artifacts.value = artifacts.value.filter(
        a => a.artifact_id !== artifactToDelete.value.artifact_id
      )
      showDeleteModal.value = false
      artifactToDelete.value = null
      // Si la página actual se queda vacía, retrocede una página si es posible
      if (paginatedArtifacts.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    } catch (error) {
      console.log('Error al borrar el artifact', error)
      showDeleteModal.value = false
      artifactToDelete.value = null
    }
  }

  const editArtifact = (item) => {
    router.push(`/equipment/${item.equipment_id}/edit`)
  }

  onMounted(async () => {
    try {
      const res = await equipmentService.getArtifacts()
      artifacts.value = res.data
    } catch (error) {
      console.error('Error loading artifacts:', error)
    }
  })
</script>