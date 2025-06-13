<template>
  <div class="max-w-3xl mx-auto">
    <!-- Icono, título y botón de borrar (solo admin) -->
    <div class="flex flex-col items-center mb-6 relative">
      <img
        :src="getClassImage(classData.name)"
        :alt="classData.name"
        class="w-28 h-28 object-cover rounded-full border-4 border-amber-700 bg-gray-800 mb-3"
        @error="onImgError"
        v-if="classData.name"
      />
      <h1 class="text-3xl font-medieval text-amber-500 font-bold mb-2">{{ classData.name }}</h1>
      <div v-if="authStore.user && authStore.user.is_admin" class="absolute top-0 right-0 flex gap-2 z-10">
        <!-- Botón editar -->
        <button
          class="bg-green-700 hover:bg-green-600 text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold shadow transition"
          @click="editClass"
          title="Edit class"
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
          title="Delete class"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Descripción y nivel de subclase -->
    <div class="bg-gray-900 border border-amber-900/30 rounded-lg p-5 mb-6">
      <p class="text-gray-200 mb-2">{{ classData.description }}</p>
      <div class="text-amber-300 text-sm">
        Subclass unlock level: <span class="font-semibold">{{ classData.subclass_level }}</span>
      </div>
    </div>

    <!-- Subclases -->
    <div v-if="subclasses.length" class="mb-8">
      <h2 class="text-xl font-bold text-amber-400 font-medieval mb-4">Subclasses</h2>
      <div class="flex flex-wrap gap-4">
        <RouterLink
          v-for="sub in subclasses"
          :key="sub.subclass_id"
          :to="`/classes/${classData.class_id}/subclasses/${sub.subclass_id}`"
          class="flex-1 min-w-[220px] max-w-xs bg-gray-950 border border-amber-900/40 rounded-lg shadow p-4 flex flex-col hover:shadow-amber-700/40 transition-shadow duration-200 cursor-pointer hover:bg-gray-900"
        >
          <h3 class="text-lg font-bold text-amber-300 mb-1">{{ sub.name }}</h3>
          <p class="text-gray-200 text-sm">{{ sub.description }}</p>
        </RouterLink>
      </div>
    </div>

    <!-- Features -->
    <div>
      <h2 class="text-xl font-bold text-amber-400 font-medieval mb-4">Class Features</h2>
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
          Are you sure you want to delete the class
          <span class="text-amber-400 font-bold">{{ classData.name }}</span>?
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

  const classData = ref({})
  const subclasses = ref([])
  const features = ref([])

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

  const confirmDelete = async () => {
    try {
      await adminService.deleteClass(classId)
      showDeleteModal.value = false
      router.push('/classes')
    } catch (error) {
      console.log('Error deleting the class', error)
      showDeleteModal.value = false
    }
  }

  const editClass = () => {
    router.push(`/classes/${classId}/edit`)
  }

  onMounted(async () => {
    try {
      // Datos de la clase y subclases
      const res = await classService.getOne(classId)
      classData.value = res.data
      subclasses.value = res.data.subclasses || []

      // Features de la clase
      const featuresRes = await classService.getFeatures(classId)
      features.value = featuresRes.data
    } catch (error) {
      router.push('/classes')
    }
  })
</script>