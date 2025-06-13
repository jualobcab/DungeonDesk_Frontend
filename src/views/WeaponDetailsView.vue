<template>
  <div>
    <div class="relative">
      <!-- Botones admin arriba a la derecha -->
      <div
        v-if="authStore.user && authStore.user.is_admin"
        class="absolute top-0 right-0 flex gap-2 z-10"
      >
        <!-- Editar -->
        <button
          class="bg-green-700 hover:bg-green-600 text-white rounded-full p-2 transition"
          @click="editWeapon"
          title="Editar weapon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
          </svg>
        </button>
        <!-- Borrar -->
        <button
          class="bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-2 transition"
          @click="showDeleteModal = true"
          title="Borrar weapon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Weapon Details</h1>
      <div class="flex flex-col items-center bg-gray-900 border border-amber-900/30 rounded-lg p-8 max-w-xl mx-auto">
        <img
          src="../assets/img/equipmentIcons/weapon.jpg"
          alt="weapon"
          class="w-28 h-28 object-contain rounded bg-gray-800 border border-amber-900/30 mb-6"
          @error="onImgError"
        />
        <h2 class="text-2xl font-bold text-amber-400 font-medieval mb-2">{{ weapon.name }}</h2>
        <div class="text-sm text-gray-300 mb-2">
          <span class="font-semibold text-amber-300">Type:</span>
          <span class="ml-1">{{ weapon.type }}</span>
        </div>
        <div class="text-sm text-gray-300 mb-2">
          <span class="font-semibold text-amber-300">Damage:</span>
          <span class="ml-1 text-blue-300">{{ weapon.damage_die }}</span>
          <span class="ml-1 text-gray-300">{{ weapon.damage_type }}</span>
        </div>
        <div class="text-sm text-gray-300 mb-2">
          <span class="font-semibold text-amber-300">Rarity:</span>
          <span :class="rarityClass(weapon.rarity)" class="font-semibold ml-1">{{ weapon.rarity }}</span>
        </div>
        <p class="text-gray-200 text-base mt-4">{{ weapon.description }}</p>
      </div>
    </div>

    <!-- Modal de confirmación de borrado -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-sm w-full shadow-xl flex flex-col items-center">
        <p class="text-lg text-gray-100 mb-6 text-center">
          ¿Seguro que quieres borrar el weapon <span class="text-amber-400 font-bold">{{ weapon.name }}</span>?
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { equipmentService, adminService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const weapon = ref({})
const showDeleteModal = ref(false)
const authStore = useAuthStore()

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

const onImgError = (event) => {
  event.target.src = new URL('../assets/img/equipmentIcons/default.jpg', import.meta.url).href
}

const editWeapon = () => {
  router.push(`/equipment/${weapon.value.equipment_id}/edit`)
}

const confirmDelete = async () => {
  try {
    await adminService.deleteWeapon(route.params.id)
    showDeleteModal.value = false
    router.push('/equipment/weapons')
  } catch (error) {
    alert('Error al borrar el weapon')
    showDeleteModal.value = false
  }
}

onMounted(async () => {
  try {
    const res = await equipmentService.getWeapon(route.params.id)
    weapon.value = res.data
  } catch (error) {
    router.push('/equipment/weapons')
  }
})
</script>