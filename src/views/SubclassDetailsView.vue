<template>
  <div class="max-w-2xl mx-auto">
    <!-- Icono, título y botones de editar/borrar (solo admin) -->
    <div class="flex flex-col items-center mb-6 relative">
      <img
        :src="getClassImage(className)"
        :alt="className"
        class="w-28 h-28 object-cover rounded-full border-4 border-amber-700 bg-gray-800 mb-3"
        @error="onImgError"
        v-if="className"
      />
      <h1 class="text-3xl font-medieval text-amber-500 font-bold mb-2">{{ subclass.name }}</h1>
      <div
        v-if="authStore.user && authStore.user.is_admin"
        class="absolute top-0 right-0 flex gap-2 z-10"
      >
        <!-- Botón editar -->
        <button
          class="bg-green-700 hover:bg-green-600 text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold shadow transition"
          @click="editSubclass"
          title="Edit subclass"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
          </svg>
          Edit
        </button>
        <!-- Botón borrar -->
        <button
          class="bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-2 transition"
          @click="showDeleteModal = true"
          title="Delete subclass"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Descripción -->
    <div class="bg-gray-900 border border-amber-900/30 rounded-lg p-5 mb-6">
      <p class="text-gray-200">{{ subclass.description }}</p>
    </div>

    <!-- Features -->
    <div>
      <h2 class="text-xl font-bold text-amber-400 font-medieval mb-4">Subclass Features</h2>
      <ul class="space-y-4">
        <li
          v-for="feature in features"
          :key="feature.feature_id"
          class="bg-gray-900 border border-amber-900/30 rounded-lg p-4"
        >
          <div class="flex items-center mb-1">
            <span class="text-amber-500 font-semibold mr-2">{{ feature.name }}</span>
            <span class="text-xs text-amber-300 ml-auto">Level: {{ feature.level }}</span>
          </div>
          <div class="text-gray-200 text-sm">{{ feature.description }}</div>
        </li>
      </ul>
    </div>

    <!-- Modal de confirmación de borrado -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-sm w-full shadow-xl flex flex-col items-center">
        <p class="text-lg text-gray-100 mb-6 text-center">
          Are you sure you want to delete the subclass
          <span class="text-amber-400 font-bold">{{ subclass.name }}</span>?
        </p>
        <div class="flex gap-4">
          <button
            class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold"
            @click="confirmDelete"
          >
            Yes, delete
          </button>
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
            @click="showDeleteModal = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { classService, adminService } from '@/services/api'
  import { useAuthStore } from '@/stores/auth'

  const route = useRoute()
  const router = useRouter()
  const classId = route.params.id
  const subclassId = route.params.subclassId

  const subclass = ref({})
  const features = ref([])
  const className = ref('')

  const showDeleteModal = ref(false)
  const authStore = useAuthStore()

  const getClassImage = (name) => {
    if (!name) return ''
    const fileName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    return new URL(`../assets/img/classIcons/${fileName}.jpeg`, import.meta.url).href
  }

  const onImgError = (event) => {
    event.target.src = new URL('../assets/img/classIcons/default.jpeg', import.meta.url).href
  }

  const editSubclass = () => {
    router.push(`/subclasses/${subclassId}/edit`)
  }

  const confirmDelete = async () => {
    try {
      await adminService.deleteSubclass(subclassId)
      showDeleteModal.value = false
      router.push(`/classes/${classId}`)
    } catch (e) {
      alert('Error deleting the subclass')
      showDeleteModal.value = false
    }
  }

  onMounted(async () => {
    try {
      // Datos de la subclase
      const res = await classService.getSubclass(classId, subclassId)
      subclass.value = res.data

      // Obtener el nombre de la clase usando el class_id
      const classRes = await classService.getOne(res.data.class_id)
      className.value = classRes.data.name

      // Features de la subclase
      const featuresRes = await classService.getSubclassFeatures(classId, subclassId)
      features.value = featuresRes.data
    } catch (error) {
      console.error('Error loading subclass details:', error)
    }
  })
</script>