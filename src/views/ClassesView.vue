<template>
  <div>
    <div class="flex items-center justify-center mb-8 relative">
      <h1 class="text-3xl font-medieval text-amber-500 text-center w-full">DnD Classes</h1>
      <div
        v-if="authStore.user && authStore.user.is_admin"
        class="absolute right-0 flex items-center gap-2"
      >
        <RouterLink
          to="/classes/create"
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition ml-4"
        >
          New Class
        </RouterLink>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div
        v-for="classItem in classes"
        :key="classItem.class_id"
        class="relative bg-gray-900 border border-amber-900/30 rounded-lg shadow-lg p-5 flex flex-col items-center hover:shadow-amber-700/40 transition-shadow duration-200 cursor-pointer"
      >
        <RouterLink
          :to="`/classes/${classItem.class_id}`"
          class="flex flex-col items-center w-full h-full"
        >
          <img
            :src="getClassImage(classItem.name)"
            :alt="classItem.name"
            class="w-24 h-24 object-cover rounded-full border-4 border-amber-700 mb-4 bg-gray-800"
            @error="onImgError"
          />
          <h2 class="text-xl font-bold text-amber-400 font-medieval mb-2">{{ classItem.name }}</h2>
          <p class="text-gray-200 text-center mb-2">{{ classItem.description }}</p>
          <div class="text-xs text-amber-300 mt-auto">
            Subclass unlock level: <span class="font-semibold">{{ classItem.subclass_level }}</span>
          </div>
        </RouterLink>
        <!-- Botón de borrar solo para admin -->
        <button
          v-if="authStore.user && authStore.user.is_admin"
          class="absolute top-2 right-2 bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-2 transition z-10"
          @click="openDeleteModal(classItem)"
          title="Delete class"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
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
          Are you sure you want to delete the class
          <span class="text-amber-400 font-bold">{{ classToDelete?.name }}</span>?
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
  import { classService, adminService } from '@/services/api'
  import { RouterLink } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const classes = ref([])

  const showDeleteModal = ref(false)
  const classToDelete = ref(null)

  const getClassImage = (name) => {
    const fileName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    return new URL(`../assets/img/classIcons/${fileName}.jpeg`, import.meta.url).href
  }

  const onImgError = (event) => {
    event.target.src = new URL('../assets/img/classIcons/default.jpeg', import.meta.url).href
  }

  const openDeleteModal = (classItem) => {
    classToDelete.value = classItem
    showDeleteModal.value = true
  }

  const confirmDelete = async () => {
    if (!classToDelete.value) return
    try {
      await adminService.deleteClass(classToDelete.value.class_id)
      classes.value = classes.value.filter(
        c => c.class_id !== classToDelete.value.class_id
      )
      showDeleteModal.value = false
      classToDelete.value = null
    } catch (error) {
      console.log('Error deleting the class', error)
      showDeleteModal.value = false
      classToDelete.value = null
    }
  }

  onMounted(async () => {
    try {
      const response = await classService.getAll()
      classes.value = response.data
    } catch (error) {
      console.error('Error loading classes:', error)
    }
  })
</script>