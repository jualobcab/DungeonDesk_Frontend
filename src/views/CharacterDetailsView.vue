<template>
  <div>
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Character Details</h1>
    <div class="relative bg-gray-900 border border-amber-900/30 rounded-lg p-8 max-w-2xl mx-auto">
      <!-- Botones superiores: Level Up, Editar, Equipo, Papelera -->
      <div
        class="absolute top-4 right-4 flex flex-col gap-2 z-10 sm:flex-row-reverse sm:gap-2"
      >
        <!-- Botón de papelera -->
        <button
          class="bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-2 transition w-10 h-10 flex items-center justify-center"
          @click="showDeleteModal = true"
          title="Borrar personaje"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- Botón editar -->
        <button
          class="bg-green-700 hover:bg-green-600 text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold shadow transition w-full sm:w-auto"
          @click="editCharacter"
          title="Editar personaje"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
          </svg>
          <span class="hidden sm:inline">Editar</span>
        </button>
        <!-- Botón equipo -->
        <button
          class="bg-amber-700 hover:bg-amber-600 text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold shadow transition w-full sm:w-auto"
          @click="openEquipmentModal"
          title="Equipo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M7 7a4 4 0 018 0v4a4 4 0 01-8 0V7z" />
          </svg>
          <span class="hidden sm:inline">Equipo</span>
        </button>
        <!-- Botón Level Up -->
        <button
          v-if="character.level < 20"
          class="bg-blue-800 hover:bg-blue-600 text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold shadow transition w-full sm:w-auto"
          @click="showLevelUpModal = true"
          title="Subir de nivel"
        >
          <span class="hidden sm:inline">Level Up</span>
          <span>⏫</span>
        </button>
      </div>
      <!-- ...resto del template igual... -->
      <h2 class="text-2xl font-bold text-amber-400 font-medieval mb-2">{{ character.name }}</h2>
      <div class="text-gray-300 mb-2">
        <span class="font-semibold text-amber-300">Level:</span>
        <span class="ml-1">{{ character.level }}</span>
      </div>
      <div class="text-gray-300 mb-2" v-if="character.campaign_name">
        <span class="font-semibold text-amber-300">Campaign:</span>
        <span class="ml-1">{{ character.campaign_name }}</span>
      </div>
      <div class="mb-4">
        <span class="font-semibold text-amber-300">Biography:</span>
        <p class="text-gray-200 text-sm mt-1 whitespace-pre-line">{{ character.biography }}</p>
      </div>
      <div v-if="character.classes && character.classes.length" class="mb-4">
        <span class="font-semibold text-amber-300">Classes:</span>
        <ul class="mt-2 space-y-2">
          <li
            v-for="cls in character.classes"
            :key="cls.class_id + '-' + cls.subclass_id"
            class="bg-gray-800 border border-amber-900/20 rounded px-3 py-2 flex items-center gap-3"
          >
            <img
              :src="getClassImage(cls.class_name)"
              :alt="cls.class_name"
              class="w-8 h-8 object-cover rounded-full border-2 border-amber-700 bg-gray-800"
              @error="onClassImgError"
            />
            <span class="text-amber-400 font-bold">{{ cls.class_name }}</span>
            <span class="text-gray-300">  Lv. {{ cls.level }}</span>
            <span v-if="cls.subclass_name" class="ml-2 text-amber-300">({{ cls.subclass_name }})</span>
          </li>
        </ul>
      </div>
      <!-- Listado de features -->
      <div v-if="features.length" class="mb-2">
        <span class="font-semibold text-amber-300">Features:</span>
        <ul class="mt-2 space-y-3">
          <li
            v-for="feature in features"
            :key="feature.feature_id + '-' + feature.level + '-' + feature.source"
            class="bg-gray-800 border border-amber-900/20 rounded px-3 py-2"
          >
            <div class="flex items-center mb-1">
              <span class="text-amber-400 font-bold">{{ feature.name }}</span>
              <span class="text-xs text-amber-300 ml-2">Lv. {{ feature.level }}</span>
              <span class="ml-auto text-xs">
                <span
                  v-if="feature.source === 'class'"
                  class="text-blue-300"
                >
                  {{ feature.class_name }}
                </span>
                <span
                  v-else
                  class="text-purple-300"
                >
                  {{ feature.class_name }}<span v-if="feature.subclass_name"> ({{ feature.subclass_name }})</span>
                </span>
              </span>
            </div>
            <div class="text-gray-200 text-sm">{{ feature.description }}</div>
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
          ¿Seguro que quieres borrar al personaje <span class="text-amber-400 font-bold">{{ character.name }}</span>?
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

    <!-- Modal de equipo -->
    <div
      v-if="showEquipmentModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-blue-900/40 rounded-lg p-8 w-full max-w-screen-2xl shadow-xl flex flex-col items-center overflow-y-auto">
        <h3 class="text-xl font-bold text-amber-400 mb-4">Equipo de {{ character.name }}</h3>
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Artifacts -->
          <div>
            <h4 class="text-lg text-purple-300 font-bold mb-2">Artifacts</h4>
            <ul>
              <li v-for="item in equipmentArtifacts" :key="item.equipment_id" class="flex items-center justify-between bg-gray-800 rounded px-3 py-2 mb-2">
                <span>
                  <span class="font-semibold text-amber-300">{{ item.name }}</span>
                  <span class="ml-2 text-xs text-gray-400">({{ item.rarity }})</span>
                  <span class="ml-2 text-xs text-blue-300">{{ item.type }}</span>
                </span>
                <span class="flex items-center gap-2">
                  <button class="bg-gray-700 px-2 rounded text-lg"
                    @click="updateQuantity(item, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >-</button>
                  <span class="font-bold text-amber-400">{{ item.quantity }}</span>
                  <button class="bg-gray-700 px-2 rounded text-lg"
                    @click="updateQuantity(item, item.quantity + 1)"
                  >+</button>
                  <button class="bg-red-800 hover:bg-red-700 text-white rounded px-2 py-1 ml-2"
                    @click="removeEquipment(item)"
                  >🗑️</button>
                </span>
              </li>
            </ul>
            <button
              class="w-full mt-2 bg-purple-700 hover:bg-purple-600 text-white rounded py-1 font-bold"
              @click="showAddArtifact = !showAddArtifact"
            >Añadir artifact</button>
            <div v-if="showAddArtifact" class="mt-2">
              <select v-model="selectedArtifactToAdd" class="w-full bg-gray-800 border border-amber-900/30 text-gray-100 rounded px-2 py-1">
                <option value="" disabled>Selecciona un artifact</option>
                <option v-for="item in availableArtifacts" :key="item.artifact_id" :value="item.equipment_id">
                  {{ item.name }} ({{ item.rarity }})
                </option>
              </select>
              <button
                class="mt-2 bg-purple-700 hover:bg-purple-600 text-white rounded px-3 py-1 font-bold"
                @click="addEquipment('artifact')"
                :disabled="!selectedArtifactToAdd"
              >Añadir</button>
            </div>
          </div>
          <!-- Weapons -->
          <div>
            <h4 class="text-lg text-blue-300 font-bold mb-2">Weapons</h4>
            <ul>
              <li v-for="item in equipmentWeapons" :key="item.equipment_id" class="flex items-center justify-between bg-gray-800 rounded px-3 py-2 mb-2">
                <span>
                  <span class="font-semibold text-amber-300">{{ item.name }}</span>
                  <span class="ml-2 text-xs text-gray-400">({{ item.rarity }})</span>
                  <span class="ml-2 text-xs text-blue-300">{{ item.type }}</span>
                </span>
                <span class="flex items-center gap-2">
                  <button class="bg-gray-700 px-2 rounded text-lg"
                    @click="updateQuantity(item, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >-</button>
                  <span class="font-bold text-amber-400">{{ item.quantity }}</span>
                  <button class="bg-gray-700 px-2 rounded text-lg"
                    @click="updateQuantity(item, item.quantity + 1)"
                  >+</button>
                  <button class="bg-red-800 hover:bg-red-700 text-white rounded px-2 py-1 ml-2"
                    @click="removeEquipment(item)"
                  >🗑️</button>
                </span>
              </li>
            </ul>
            <button
              class="w-full mt-2 bg-blue-700 hover:bg-blue-600 text-white rounded py-1 font-bold"
              @click="showAddWeapon = !showAddWeapon"
            >Añadir weapon</button>
            <div v-if="showAddWeapon" class="mt-2">
              <select v-model="selectedWeaponToAdd" class="w-full bg-gray-800 border border-amber-900/30 text-gray-100 rounded px-2 py-1">
                <option value="" disabled>Selecciona un weapon</option>
                <option v-for="item in availableWeapons" :key="item.weapon_id" :value="item.equipment_id">
                  {{ item.name }} ({{ item.rarity }})
                </option>
              </select>
              <button
                class="mt-2 bg-blue-700 hover:bg-blue-600 text-white rounded px-3 py-1 font-bold"
                @click="addEquipment('weapon')"
                :disabled="!selectedWeaponToAdd"
              >Añadir</button>
            </div>
          </div>
          <!-- Armors -->
          <div>
            <h4 class="text-lg text-green-300 font-bold mb-2">Armors</h4>
            <ul>
              <li v-for="item in equipmentArmors" :key="item.equipment_id" class="flex items-center justify-between bg-gray-800 rounded px-3 py-2 mb-2">
                <span>
                  <span class="font-semibold text-amber-300">{{ item.name }}</span>
                  <span class="ml-2 text-xs text-gray-400">({{ item.rarity }})</span>
                  <span class="ml-2 text-xs text-blue-300">{{ item.type }}</span>
                </span>
                <span class="flex items-center gap-2">
                  <button class="bg-gray-700 px-2 rounded text-lg"
                    @click="updateQuantity(item, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >-</button>
                  <span class="font-bold text-amber-400">{{ item.quantity }}</span>
                  <button class="bg-gray-700 px-2 rounded text-lg"
                    @click="updateQuantity(item, item.quantity + 1)"
                  >+</button>
                  <button class="bg-red-800 hover:bg-red-700 text-white rounded px-2 py-1 ml-2"
                    @click="removeEquipment(item)"
                  >🗑️</button>
                </span>
              </li>
            </ul>
            <button
              class="w-full mt-2 bg-green-700 hover:bg-green-600 text-white rounded py-1 font-bold"
              @click="showAddArmor = !showAddArmor"
            >Añadir armor</button>
            <div v-if="showAddArmor" class="mt-2">
              <select v-model="selectedArmorToAdd" class="w-full bg-gray-800 border border-amber-900/30 text-gray-100 rounded px-2 py-1">
                <option value="" disabled>Selecciona un armor</option>
                <option v-for="item in availableArmors" :key="item.armor_id" :value="item.equipment_id">
                  {{ item.name }} ({{ item.rarity }})
                </option>
              </select>
              <button
                class="mt-2 bg-green-700 hover:bg-green-600 text-white rounded px-3 py-1 font-bold"
                @click="addEquipment('armor')"
                :disabled="!selectedArmorToAdd"
              >Añadir</button>
            </div>
          </div>
        </div>
        <button class="mt-6 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold" @click="closeEquipmentModal">
          Cerrar
        </button>
      </div>
    </div>

    <!-- Modal Level Up -->
    <div
      v-if="showLevelUpModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-blue-900/40 rounded-lg p-8 max-w-md w-full shadow-xl flex flex-col items-center">
        <h3 class="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          Level Up <span>⏫</span>
        </h3>
        <div class="w-full mb-4">
          <label class="block text-amber-300 font-semibold mb-2">Clase</label>
          <select
            v-model="selectedClassId"
            @change="onClassChange"
            class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
          >
            <option value="" disabled>Selecciona una clase</option>
            <option
              v-for="cls in allClasses"
              :key="cls.class_id"
              :value="cls.class_id"
            >
              {{ cls.name }}
            </option>
          </select>
          <div v-if="selectedClassObj" class="flex items-center gap-2 mt-2">
            <img
              :src="getClassImage(selectedClassObj.name)"
              :alt="selectedClassObj.name"
              class="w-8 h-8 object-cover rounded-full border-2 border-amber-700 bg-gray-800"
              @error="onClassImgError"
            />
            <span class="text-amber-400 font-bold">{{ selectedClassObj.name }}</span>
            <span class="text-xs text-gray-300 ml-2">Subclase al nivel {{ selectedClassObj.subclass_level }}</span>
          </div>
        </div>
        <div class="w-full mb-4" v-if="showSubclassSelect">
          <label class="block text-amber-300 font-semibold mb-2">Subclase</label>
          <select
            v-model="selectedSubclassId"
            class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
          >
            <option value="" disabled>Selecciona una subclase</option>
            <option
              v-for="sub in subclasses"
              :key="sub.subclass_id"
              :value="sub.subclass_id"
            >
              {{ sub.name }}
            </option>
          </select>
        </div>
        <div class="flex gap-4 mt-2">
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
            @click="closeLevelUpModal"
          >
            He cambiado de idea
          </button>
          <button
            class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold"
            @click="submitLevelUp"
          >
            Subir nivel
          </button>
        </div>
        <div v-if="levelUpError" class="text-red-400 mt-4 text-center">{{ levelUpError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { characterService, classService, equipmentService } from '@/services/api'

  const route = useRoute()
  const router = useRouter()
  const character = ref({})
  const features = ref([])
  const showDeleteModal = ref(false)

  // Equipo modal state
  const showEquipmentModal = ref(false)
  const equipmentList = ref([])
  const allArtifacts = ref([])
  const allWeapons = ref([])
  const allArmors = ref([])
  const showAddArtifact = ref(false)
  const showAddWeapon = ref(false)
  const showAddArmor = ref(false)
  const selectedArtifactToAdd = ref('')
  const selectedWeaponToAdd = ref('')
  const selectedArmorToAdd = ref('')

  // Level Up modal state
  const showLevelUpModal = ref(false)
  const allClasses = ref([])
  const subclasses = ref([])
  const selectedClassId = ref('')
  const selectedSubclassId = ref('')
  const levelUpError = ref('')

  // Botón editar
  const editCharacter = () => {
    router.push(`/characters/${character.value.id_character}/edit`)
  }

  // Equipo modal logic
  const openEquipmentModal = async () => {
    showEquipmentModal.value = true
    showAddArtifact.value = false
    showAddWeapon.value = false
    showAddArmor.value = false
    selectedArtifactToAdd.value = ''
    selectedWeaponToAdd.value = ''
    selectedArmorToAdd.value = ''
    // Cargar equipo actual
    const res = await characterService.getEquipment(character.value.id_character)
    equipmentList.value = res.data
    // Cargar todos los artifacts, weapons y armors
    const [artifactsRes, weaponsRes, armorsRes] = await Promise.all([
      equipmentService.getArtifacts(),
      equipmentService.getWeapons(),
      equipmentService.getArmors()
    ])
    allArtifacts.value = artifactsRes.data
    allWeapons.value = weaponsRes.data
    allArmors.value = armorsRes.data
  }

  const closeEquipmentModal = () => {
    showEquipmentModal.value = false
    equipmentList.value = []
  }

  const equipmentArtifacts = computed(() =>
    equipmentList.value.filter(e => e.type && e.type.toLowerCase() === 'artifact')
  )
  const equipmentWeapons = computed(() =>
    equipmentList.value.filter(e => e.type && e.type.toLowerCase() === 'weapon')
  )
  const equipmentArmors = computed(() =>
    equipmentList.value.filter(e => e.type && e.type.toLowerCase() === 'armor')
  )

  const availableArtifacts = computed(() => {
    const owned = new Set(equipmentArtifacts.value.map(e => e.equipment_id))
    return allArtifacts.value.filter(a => !owned.has(a.equipment_id))
  })
  const availableWeapons = computed(() => {
    const owned = new Set(equipmentWeapons.value.map(e => e.equipment_id))
    return allWeapons.value.filter(w => !owned.has(w.equipment_id))
  })
  const availableArmors = computed(() => {
    const owned = new Set(equipmentArmors.value.map(e => e.equipment_id))
    return allArmors.value.filter(a => !owned.has(a.equipment_id))
  })

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return
    await characterService.updateEquipment(character.value.id_character, item.equipment_id, newQuantity)
    // Recarga el equipo completo para evitar referencias compartidas
    const res = await characterService.getEquipment(character.value.id_character)
    equipmentList.value = res.data
  }
  
  const removeEquipment = async (item) => {
    await characterService.removeEquipment(character.value.id_character, item.equipment_id)
    equipmentList.value = equipmentList.value.filter(e => e.equipment_id !== item.equipment_id)
  }

  const addEquipment = async (type) => {
    let equipmentId = null
    if (type === 'artifact') equipmentId = selectedArtifactToAdd.value
    if (type === 'weapon') equipmentId = selectedWeaponToAdd.value
    if (type === 'armor') equipmentId = selectedArmorToAdd.value
    if (!equipmentId) return
    await characterService.addEquipment(character.value.id_character, equipmentId)
    // Recargar equipo
    const res = await characterService.getEquipment(character.value.id_character)
    equipmentList.value = res.data
    // Limpiar selección
    if (type === 'artifact') {
      selectedArtifactToAdd.value = ''
      showAddArtifact.value = false
    }
    if (type === 'weapon') {
      selectedWeaponToAdd.value = ''
      showAddWeapon.value = false
    }
    if (type === 'armor') {
      selectedArmorToAdd.value = ''
      showAddArmor.value = false
    }
  }

  const selectedClassObj = computed(() =>
    allClasses.value.find(cls => cls.class_id == selectedClassId.value)
  )

  const showSubclassSelect = computed(() => {
    if (!selectedClassObj.value) return false
    // Buscar si el personaje ya tiene esta clase y su nivel
    const charClass = character.value.classes?.find(c => c.class_id == selectedClassId.value)
    const nextLevel = charClass ? charClass.level + 1 : 1
    return (
      selectedClassObj.value.subclass_level &&
      nextLevel === selectedClassObj.value.subclass_level
    )
  })

  const getClassImage = (name) => {
    if (!name) return new URL('../assets/img/classIcons/default.jpeg', import.meta.url).href
    const fileName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    return new URL(`../assets/img/classIcons/${fileName}.jpeg`, import.meta.url).href
  }

  const onClassImgError = (event) => {
    event.target.src = new URL('../assets/img/classIcons/default.jpeg', import.meta.url).href
  }

  const closeLevelUpModal = () => {
    showLevelUpModal.value = false
    selectedClassId.value = ''
    selectedSubclassId.value = ''
    levelUpError.value = ''
  }

  const onClassChange = async () => {
    selectedSubclassId.value = ''
    levelUpError.value = ''
    if (!selectedClassObj.value) {
      subclasses.value = []
      return
    }
    // Si hay que mostrar subclases, cargarlas
    if (showSubclassSelect.value) {
      try {
        const res = await classService.getSubclasses(selectedClassObj.value.class_id)
        subclasses.value = res.data
      } catch (e) {
        subclasses.value = []
      }
    } else {
      subclasses.value = []
    }
  }

  const submitLevelUp = async () => {
    levelUpError.value = ''
    if (!selectedClassId.value) {
      levelUpError.value = 'Debes seleccionar una clase'
      return
    }
    if (showSubclassSelect.value && !selectedSubclassId.value) {
      levelUpError.value = 'Debes seleccionar una subclase'
      return
    }
    try {
      await characterService.levelUp(character.value.id_character, {
        class_id: selectedClassId.value,
        subclass_id: showSubclassSelect.value ? selectedSubclassId.value : null
      })
      // Recargar datos del personaje y cerrar modal
      const res = await characterService.getOne(route.params.id)
      character.value = res.data
      const featuresRes = await characterService.getFeatures(route.params.id)
      features.value = featuresRes.data.map(feature => {
        const cls = character.value.classes?.find(c => c.class_id === feature.class_id)
        return {
          ...feature,
          class_name: cls?.class_name || '',
          subclass_name: feature.source === 'subclass' ? (cls?.subclass_name || '') : null
        }
      })
      closeLevelUpModal()
    } catch (error) {
      levelUpError.value =
        error?.response?.data?.message ||
        'Error al subir de nivel'
    }
  }

  const confirmDelete = async () => {
    try {
      await characterService.delete(character.value.id_character)
      showDeleteModal.value = false
      router.push('/characters')
    } catch (error) {
      console.log('Error al borrar el personaje', error)
      showDeleteModal.value = false
    }
  }

  onMounted(async () => {
    try {
      const res = await characterService.getOne(route.params.id)
      // Si no existe el personaje, redirige a /characters
      if (!res.data || !res.data.id_character) {
        router.push('/characters')
        return
      }
      character.value = res.data

      // Obtener las features del personaje
      const featuresRes = await characterService.getFeatures(route.params.id)
      features.value = featuresRes.data
        .map(feature => {
          const cls = character.value.classes?.find(c => c.class_id === feature.class_id)
          return {
            ...feature,
            class_name: cls?.class_name || '',
            subclass_name: feature.source === 'subclass' ? (cls?.subclass_name || '') : null
          }
        })
        .sort((a, b) => {
          if (a.level !== b.level) return a.level - b.level
          return a.class_name.localeCompare(b.class_name)
        })

      // Cargar todas las clases para el Level Up
      const classRes = await classService.getAll()
      allClasses.value = classRes.data
    } catch (error) {
      // Si hay error, redirige a /characters
      router.push('/characters')
    }
  })
</script>