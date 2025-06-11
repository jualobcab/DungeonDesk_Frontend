<template>
  <div>
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Characters</h1>
    <div class="flex flex-wrap gap-6 justify-center">
      <RouterLink
        v-for="character in characters"
        :key="character.id_character"
        :to="`/characters/${character.id_character}`"
        class="relative block w-full max-w-xs bg-gray-900 border border-amber-900/30 rounded-lg shadow-lg p-6 transition-colors duration-200 cursor-pointer hover:bg-blue-800 hover:border-blue-400 hover:shadow-2xl"
      >
        <!-- Botón de papelera -->
        <button
          class="absolute top-2 right-2 z-10 bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-2 transition"
          @click.stop.prevent="openDeleteModal(character)"
          title="Borrar personaje"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-amber-400 font-medieval mb-2">{{ character.name }}</h2>
        <div class="text-gray-300 mb-1">
          <span class="font-semibold text-amber-300">Level:</span>
          <span class="ml-1">{{ character.level }}</span>
        </div>
        <div class="text-gray-300 mb-1" v-if="character.campaign_name">
          <span class="font-semibold text-amber-300">Campaign:</span>
          <span class="ml-1">{{ character.campaign_name }}</span>
        </div>
        <p class="text-gray-200 text-sm mt-2 line-clamp-3">{{ character.biography }}</p>
      </RouterLink>
    </div>

    <!-- Modal de confirmación de borrado -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-sm w-full shadow-xl flex flex-col items-center">
        <p class="text-lg text-gray-100 mb-6 text-center">
          ¿Seguro que quieres borrar al personaje <span class="text-amber-400 font-bold">{{ characterToDelete?.name }}</span>?
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
import { characterService } from '@/services/api'
import { RouterLink } from 'vue-router'

const characters = ref([])
const showDeleteModal = ref(false)
const characterToDelete = ref(null)

const openDeleteModal = (character) => {
  characterToDelete.value = character
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!characterToDelete.value) return
  try {
    await characterService.delete(characterToDelete.value.id_character)
    // Elimina el personaje del array local sin recargar toda la página
    characters.value = characters.value.filter(
      c => c.id_character !== characterToDelete.value.id_character
    )
    showDeleteModal.value = false
    characterToDelete.value = null
  } catch (error) {
    alert('Error al borrar el personaje')
    showDeleteModal.value = false
    characterToDelete.value = null
  }
}

onMounted(async () => {
  try {
    const res = await characterService.getAll()
    characters.value = res.data
  } catch (error) {
    console.error('Error loading characters:', error)
  }
})
</script>