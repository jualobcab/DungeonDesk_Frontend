<template>
  <div class="max-w-xl mx-auto bg-gray-900 border border-amber-900/30 rounded-lg p-8 mt-8 shadow-lg">
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Editar Campaña</h1>
    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Nombre</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
          maxlength="255"
        />
        <div v-if="errors.name" class="text-red-400 text-sm mt-1">{{ errors.name }}</div>
      </div>
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Descripción</label>
        <textarea
          v-model="form.description"
          rows="4"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
        ></textarea>
        <div v-if="errors.description" class="text-red-400 text-sm mt-1">{{ errors.description }}</div>
      </div>
      <div class="flex gap-4 mt-6">
        <button type="submit" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition">
          Guardar cambios
        </button>
        <RouterLink to="/campaigns" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold transition">
          Cancelar
        </RouterLink>
      </div>
      <div v-if="successMessage" class="text-green-400 mt-6 text-center font-bold">{{ successMessage }}</div>
      <div v-if="generalError" class="text-red-400 mt-6 text-center font-bold">{{ generalError }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { campaignService } from '@/services/api'

const route = useRoute()
const router = useRouter()
const form = ref({
  name: '',
  description: ''
})
const errors = ref({})
const generalError = ref('')
const successMessage = ref('')

onMounted(async () => {
  try {
    const res = await campaignService.getOne(route.params.id)
    if (!res.data || !res.data.id_campaign) {
      router.push('/campaigns')
      return
    }
    form.value.name = res.data.name
    form.value.description = res.data.description
  } catch (e) {
    router.push('/campaigns')
  }
})

const validate = () => {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'El nombre es obligatorio'
  if (form.value.name && form.value.name.length > 255) errors.value.name = 'El nombre no puede superar 255 caracteres'
  return Object.keys(errors.value).length === 0
}

const submit = async () => {
  generalError.value = ''
  successMessage.value = ''
  if (!validate()) return

  try {
    await campaignService.update(route.params.id, {
      name: form.value.name,
      description: form.value.description
    })
    successMessage.value = '¡Campaña actualizada exitosamente!'
    setTimeout(() => {
      router.push('/campaigns')
    }, 1200)
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      generalError.value = error.response.data.message
    } else {
      generalError.value = 'Error al actualizar la campaña'
    }
  }
}
</script>