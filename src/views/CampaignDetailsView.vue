<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-medieval text-amber-500">{{ campaign.name }}</h1>
      <div class="flex gap-2">
        <RouterLink
          :to="`/campaigns/${campaign.id_campaign}/edit`"
          class="bg-green-700 hover:bg-green-600 text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold shadow transition"
          title="Editar campaña"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
          </svg>
          Editar
        </RouterLink>
        <button
          class="bg-amber-700 hover:bg-amber-600 text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold shadow transition"
          @click="openDiaryModal"
          title="Diario"
        >
          📓 Diario
        </button>
        <button
          class="bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-2 transition"
          @click="showDeleteModal = true"
          title="Borrar campaña"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    <div class="mb-6">
      <p class="text-lg text-gray-200 mb-2">
        <span class="font-semibold text-amber-300">Descripción:</span>
        <span class="ml-1">{{ campaign.description || 'Sin descripción' }}</span>
      </p>
    </div>
    <h2 class="text-2xl font-bold text-amber-400 font-medieval mb-4">Miembros</h2>
    <div class="flex flex-wrap gap-6 justify-center">
      <RouterLink
        v-for="character in campaign.characters"
        :key="character.id_character"
        :to="`/characters/${character.id_character}`"
        class="relative block w-full max-w-xs bg-gray-900 border border-amber-900/30 rounded-lg shadow-lg p-6 transition-colors duration-200 cursor-pointer hover:bg-blue-800 hover:border-blue-400 hover:shadow-2xl"
      >
        <h3 class="text-xl font-bold text-amber-400 font-medieval mb-2">{{ character.name }}</h3>
        <div class="text-gray-300 mb-1">
          <span class="font-semibold text-amber-300">Nivel:</span>
          <span class="ml-1">{{ character.level }}</span>
        </div>
        <div class="text-gray-300 mb-1" v-if="character.classes && character.classes.length">
          <span class="font-semibold text-amber-300">Clases:</span>
          <span class="ml-1">
            <span v-for="cls in character.classes" :key="cls.class_id + '-' + (cls.subclass_id || '')">
              {{ cls.class_name }}<span v-if="cls.subclass_name"> ({{ cls.subclass_name }})</span> Lv.{{ cls.level }}<span v-if="!isLastClass(character.classes, cls)">, </span>
            </span>
          </span>
        </div>
        <div class="text-gray-300 mb-1" v-if="character.biography">
          <span class="font-semibold text-amber-300">Biografía:</span>
          <span class="ml-1">{{ character.biography }}</span>
        </div>
      </RouterLink>
    </div>

    <!-- Modal de confirmación de borrado -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-sm w-full shadow-xl flex flex-col items-center">
        <p class="text-lg text-gray-100 mb-6 text-center">
          ¿Seguro que quieres borrar la campaña <span class="text-amber-400 font-bold">{{ campaign.name }}</span>?
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

    <!-- Modal de Diario -->
    <div
      v-if="showDiaryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-lg w-full shadow-xl flex flex-col items-center relative">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-amber-400"
          @click="showDiaryModal = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-amber-400 font-medieval mb-4">Diario de campaña</h2>
        <div v-if="diaryEntries.length === 0" class="text-gray-300 mb-4">No hay entradas de diario.</div>
        <div v-else class="w-full space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="entry in diaryEntries"
            :key="entry.entry_id"
            class="bg-gray-800 border border-amber-900/30 rounded-lg p-4 relative"
          >
            <!-- Botones editar y borrar -->
            <div class="absolute top-2 right-2 flex gap-2">
              <button
                class="bg-green-700 hover:bg-green-600 text-white rounded-full p-1 transition"
                @click="startEditDiary(entry)"
                title="Editar entrada"
                v-if="!isEditingDiary(entry.entry_id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
                </svg>
              </button>
              <button
                class="bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-1 transition"
                @click="openDeleteDiaryModal(entry)"
                title="Borrar entrada"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <!-- Edición de entry -->
            <div v-if="isEditingDiary(entry.entry_id)">
              <div class="mb-2 flex gap-2 items-center">
                <label class="text-amber-300 font-semibold">Personaje:</label>
                <select v-model="editDiaryForm.id_character" class="bg-gray-700 text-gray-100 rounded px-2 py-1">
                  <option v-for="char in campaign.characters" :key="char.id_character" :value="char.id_character">
                    {{ char.name }}
                  </option>
                </select>
              </div>
              <div class="mb-2">
                <label class="text-amber-300 font-semibold">Entrada:</label>
                <textarea v-model="editDiaryForm.entry" rows="3" class="w-full bg-gray-700 text-gray-100 rounded px-2 py-1"></textarea>
              </div>
              <div class="mb-2">
                <label class="text-amber-300 font-semibold">Fecha:</label>
                <input type="date" v-model="editDiaryForm.date" class="bg-gray-700 text-gray-100 rounded px-2 py-1" />
              </div>
              <div class="flex gap-2 mt-2">
                <button class="px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-bold" @click="submitEditDiary(entry.entry_id)">Guardar</button>
                <button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded font-bold" @click="cancelEditDiary">Cancelar</button>
              </div>
              <div v-if="editDiaryError" class="text-red-400 mt-2">{{ editDiaryError }}</div>
            </div>
            <div v-else>
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-amber-300">{{ entry.character_name || 'Anónimo' }}</span>
                <span class="text-gray-400 text-sm flex-1 text-center">{{ entry.date }}</span>
              </div>
              <div class="text-gray-200 whitespace-pre-line">{{ entry.entry }}</div>
            </div>
          </div>
        </div>
        <!-- Botón para crear nueva entry -->
        <div class="w-full flex justify-center mt-6">
          <button
            class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition"
            @click="showCreateDiaryModal = true"
          >
            Crear nueva entrada
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de borrado de diary -->
    <div
      v-if="showDeleteDiaryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-sm w-full shadow-xl flex flex-col items-center">
        <p class="text-lg text-gray-100 mb-6 text-center">
          ¿Seguro que quieres borrar esta entrada de diario?
        </p>
        <div class="flex gap-4">
          <button
            class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold"
            @click="confirmDeleteDiary"
          >
            Sí, seguro
          </button>
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
            @click="showDeleteDiaryModal = false"
          >
            No quiero
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para crear diary entry -->
    <div
      v-if="showCreateDiaryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-md w-full shadow-xl flex flex-col items-center relative">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-amber-400"
          @click="showCreateDiaryModal = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 class="text-xl font-bold text-amber-400 mb-4">Nueva entrada de diario</h2>
        <form @submit.prevent="submitCreateDiary" class="w-full">
          <div class="mb-3">
            <label class="block text-amber-300 font-semibold mb-1">Personaje</label>
            <select v-model="createDiaryForm.id_character" class="w-full bg-gray-700 text-gray-100 rounded px-2 py-1">
              <option value="">Selecciona un personaje</option>
              <option v-for="char in campaign.characters" :key="char.id_character" :value="char.id_character">
                {{ char.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-amber-300 font-semibold mb-1">Entrada</label>
            <textarea v-model="createDiaryForm.entry" rows="3" class="w-full bg-gray-700 text-gray-100 rounded px-2 py-1"></textarea>
          </div>
          <div class="mb-3">
            <label class="block text-amber-300 font-semibold mb-1">Fecha</label>
            <input type="date" v-model="createDiaryForm.date" class="w-full bg-gray-700 text-gray-100 rounded px-2 py-1" />
          </div>
          <div v-if="createDiaryError" class="text-red-400 mb-2">{{ createDiaryError }}</div>
          <div class="flex gap-2 mt-2 justify-center">
            <button type="submit" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold">Crear</button>
            <button type="button" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold" @click="showCreateDiaryModal = false">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter, RouterLink } from 'vue-router'
  import { campaignService } from '@/services/api'

  const route = useRoute()
  const router = useRouter()
  const campaign = ref({
    id_campaign: '',
    name: '',
    description: '',
    characters: []
  })
  const showDeleteModal = ref(false)
  const showDiaryModal = ref(false)
  const diaryEntries = ref([])

  const showDeleteDiaryModal = ref(false)
  const diaryToDelete = ref(null)
  const showCreateDiaryModal = ref(false)
  const createDiaryForm = ref({
    id_character: '',
    entry: '',
    date: ''
  })
  const createDiaryError = ref('')
  const editingDiaryId = ref(null)
  const editDiaryForm = ref({
    id_character: '',
    entry: '',
    date: ''
  })
  const editDiaryError = ref('')

  const isLastClass = (classes, cls) => {
    return classes[classes.length - 1] === cls
  }

  const fetchCampaign = async () => {
    try {
      const res = await campaignService.getOne(route.params.id)
      if (!res.data || !res.data.id_campaign) {
      router.push('/campaigns')
        return
      }
      campaign.value = res.data
    } catch (e) {
      router.push('/campaigns')
    }
  }

  const fetchDiary = async () => {
    try {
      const res = await campaignService.getDiary(campaign.value.id_campaign)
      diaryEntries.value = res.data
    } catch (e) {
      diaryEntries.value = []
    }
  }

  const openDiaryModal = async () => {
    showDiaryModal.value = true
    await fetchDiary()
  }

  // --- Diary CRUD ---
  const openDeleteDiaryModal = (entry) => {
    diaryToDelete.value = entry
    showDeleteDiaryModal.value = true
  }

  const confirmDeleteDiary = async () => {
    if (!diaryToDelete.value) return
    try {
      await campaignService.deleteDiaryEntry(campaign.value.id_campaign, diaryToDelete.value.entry_id)
      diaryEntries.value = diaryEntries.value.filter(e => e.entry_id !== diaryToDelete.value.entry_id)
      showDeleteDiaryModal.value = false
      diaryToDelete.value = null
    } catch (e) {
      showDeleteDiaryModal.value = false
      diaryToDelete.value = null
      console.log('Error al borrar la entrada', error)
    }
  }

  const isEditingDiary = (entryId) => editingDiaryId.value === entryId

  const startEditDiary = (entry) => {
    editingDiaryId.value = entry.entry_id
    editDiaryForm.value = {
      id_character: campaign.value.characters.find(c => c.name === entry.character_name)?.id_character || '',
      entry: entry.entry,
      date: entry.date
    }
    editDiaryError.value = ''
  }

  const cancelEditDiary = () => {
    editingDiaryId.value = null
    editDiaryError.value = ''
  }

  const submitEditDiary = async (entryId) => {
    editDiaryError.value = ''
    if (!editDiaryForm.value.id_character || !editDiaryForm.value.entry || !editDiaryForm.value.date) {
      editDiaryError.value = 'Todos los campos son obligatorios'
      return
    }
    // Comprobar que el personaje pertenece a la campaña
    if (!campaign.value.characters.some(c => c.id_character == editDiaryForm.value.id_character)) {
      editDiaryError.value = 'El personaje no pertenece a la campaña'
      return
    }
    try {
      await campaignService.updateDiaryEntry(
        campaign.value.id_campaign,
        entryId,
        {
          id_character: editDiaryForm.value.id_character,
          entry: editDiaryForm.value.entry,
          date: editDiaryForm.value.date
        }
      )
      await fetchDiary()
      editingDiaryId.value = null
    } catch (e) {
      editDiaryError.value = 'Error al actualizar la entrada'
    }
  }

  const submitCreateDiary = async () => {
    createDiaryError.value = ''
    if (!createDiaryForm.value.id_character || !createDiaryForm.value.entry || !createDiaryForm.value.date) {
      createDiaryError.value = 'Todos los campos son obligatorios'
      return
    }
    // Comprobar que el personaje pertenece a la campaña
    if (!campaign.value.characters.some(c => c.id_character == createDiaryForm.value.id_character)) {
      createDiaryError.value = 'El personaje no pertenece a la campaña'
      return
    }
    try {
      await campaignService.createDiaryEntry(
        campaign.value.id_campaign,
        {
          id_character: createDiaryForm.value.id_character,
          entry: createDiaryForm.value.entry,
          date: createDiaryForm.value.date
        }
      )
      await fetchDiary()
      showCreateDiaryModal.value = false
      createDiaryForm.value = { id_character: '', entry: '', date: '' }
    } catch (e) {
      createDiaryError.value = 'Error al crear la entrada'
    }
  }

  onMounted(fetchCampaign)
</script>