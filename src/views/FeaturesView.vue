<template>
  <div>
    <div class="flex items-center justify-center mb-8 relative">
      <h1 class="text-3xl font-medieval text-amber-500 text-center w-full">Features</h1>
      <div class="absolute right-0">
        <RouterLink
          to="/features/create"
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition ml-4"
        >
          New Feature
        </RouterLink>
      </div>
    </div>
    <div class="flex flex-wrap gap-6 justify-center">
      <RouterLink
        v-for="feature in paginatedFeatures"
        :key="feature.feature_id"
        :to="`/features/${feature.feature_id}`"
        class="relative block w-full max-w-xs bg-gray-900 border border-amber-900/30 rounded-lg shadow-lg p-6 transition-colors duration-200 cursor-pointer hover:bg-blue-800 hover:border-blue-400 hover:shadow-2xl"
      >
        <!-- Botón de borrado -->
        <button
          class="absolute top-2 right-2 z-10 bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-2 transition"
          @click.stop.prevent="openDeleteModal(feature)"
          title="Borrar feature"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 class="text-xl font-bold text-amber-400 font-medieval mb-2">{{ feature.name }}</h2>
        <div class="text-gray-300 text-sm mb-1">
          {{ feature.description || 'Sin descripción' }}
        </div>
      </RouterLink>
    </div>

    <!-- Paginación -->
    <div class="flex justify-center mt-8 gap-2">
      <button
        class="px-3 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 font-bold"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        &lt;
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="px-3 py-1 rounded font-bold"
        :class="page === currentPage ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
      <button
        class="px-3 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 font-bold"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        &gt;
      </button>
    </div>

    <!-- Modal de confirmación de borrado -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-sm w-full shadow-xl flex flex-col items-center">
        <p class="text-lg text-gray-100 mb-6 text-center">
          ¿Seguro que quieres borrar la feature <span class="text-amber-400 font-bold">{{ featureToDelete?.name }}</span>?
        </p>
        <div class="flex gap-4">
          <button
            class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold"
            @click="confirmDelete"
          >
            Sí, seguro
          </button>
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
            @click="showDeleteModal = false"
          >
            No quiero
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminService } from '@/services/api'
import { RouterLink } from 'vue-router'

const features = ref([])
const showDeleteModal = ref(false)
const featureToDelete = ref(null)
const currentPage = ref(1)
const pageSize = 9

const sortedFeatures = computed(() =>
  [...features.value].sort((a, b) => a.name.localeCompare(b.name))
)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedFeatures.value.length / pageSize))
)

const paginatedFeatures = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedFeatures.value.slice(start, start + pageSize)
})

const openDeleteModal = (feature) => {
  featureToDelete.value = feature
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!featureToDelete.value) return
  try {
    await adminService.deleteFeature(featureToDelete.value.feature_id)
    features.value = features.value.filter(
      f => f.feature_id !== featureToDelete.value.feature_id
    )
    showDeleteModal.value = false
    featureToDelete.value = null
    // Si la página actual se queda vacía, retrocede una página si es posible
    if (paginatedFeatures.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  } catch (error) {
    alert('Error al borrar la feature')
    showDeleteModal.value = false
    featureToDelete.value = null
  }
}

onMounted(async () => {
  try {
    const res = await adminService.getFeatures()
    features.value = res.data
  } catch (error) {
    console.error('Error loading features:', error)
  }
})
</script>