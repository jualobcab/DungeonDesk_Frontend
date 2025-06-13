<template>
  <div>
    <div class="relative bg-gray-900 border border-amber-900/30 rounded-lg p-8 max-w-2xl mx-auto mt-8 shadow-lg">
      <!-- Botones superiores: Editar y Borrar -->
      <div class="absolute top-4 right-4 flex flex-row-reverse gap-2 z-10">
        <!-- Botón de borrar -->
        <button
          class="bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-2 transition"
          @click="showDeleteModal = true"
          title="Borrar feature"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- Botón de editar -->
        <button
          class="bg-green-700 hover:bg-green-600 text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold shadow transition"
          @click="editFeature"
          title="Editar feature"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
          </svg>
          Editar
        </button>
      </div>
      <h1 class="text-3xl font-medieval text-amber-500 mb-4">{{ feature.name }}</h1>
      <div class="mb-6">
        <span class="font-semibold text-amber-300">Descripción:</span>
        <p class="text-gray-200 text-sm mt-1 whitespace-pre-line">{{ feature.description || 'Sin descripción' }}</p>
      </div>
      <div v-if="feature.classes && feature.classes.length">
        <h2 class="text-2xl font-bold text-amber-400 font-medieval mb-2">Clases que la obtienen</h2>
        <ul class="space-y-2">
          <li
            v-for="cls in feature.classes"
            :key="'class-' + cls.class_id"
            class="bg-gray-800 border border-amber-900/20 rounded px-3 py-2 flex items-center gap-3"
          >
            <span class="text-amber-400 font-bold">{{ cls.name }}</span>
            <span class="text-gray-300">Lv. {{ cls.level }}</span>
          </li>
        </ul>
      </div>
      <div v-if="feature.subclasses && feature.subclasses.length" class="mt-6">
        <h2 class="text-2xl font-bold text-purple-400 font-medieval mb-2">Subclases que la obtienen</h2>
        <ul class="space-y-2">
          <li
            v-for="sub in feature.subclasses"
            :key="'subclass-' + sub.subclass_id"
            class="bg-gray-800 border border-purple-900/20 rounded px-3 py-2 flex items-center gap-3"
          >
            <span class="text-purple-300 font-bold">{{ sub.name }}</span>
            <span class="text-gray-300">Lv. {{ sub.level }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal de confirmación de borrado -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-sm w-full shadow-xl flex flex-col items-center">
        <p class="text-lg text-gray-100 mb-6 text-center">
          ¿Seguro que quieres borrar la feature <span class="text-amber-400 font-bold">{{ feature.name }}</span>?
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
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { adminService } from '@/services/api'

  const route = useRoute()
  const router = useRouter()
  const feature = ref({
    name: '',
    description: '',
    classes: [],
    subclasses: []
  })
  const showDeleteModal = ref(false)

  const fetchFeature = async () => {
    try {
      const res = await adminService.getFeature(route.params.id)
      feature.value = res.data
    } catch (e) {
      router.push('/features')
    }
  }

  const confirmDelete = async () => {
    try {
      await adminService.deleteFeature(route.params.id)
      showDeleteModal.value = false
      router.push('/features')
    } catch (error) {
      console.error('Error al borrar la feature', error)
      showDeleteModal.value = false
    }
  }

  const editFeature = () => {
    router.push(`/features/${route.params.id}/edit`)
  }

  onMounted(fetchFeature)
</script>