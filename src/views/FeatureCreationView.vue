<template>
  <div class="max-w-xl mx-auto bg-gray-900 border border-amber-900/30 rounded-lg p-8 mt-8 shadow-lg">
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Crear Feature</h1>
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
          Crear feature
        </button>
        <RouterLink to="/features" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold transition">
          Cancelar
        </RouterLink>
      </div>
      <div v-if="generalError" class="text-red-400 mt-6 text-center font-bold">{{ generalError }}</div>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter, RouterLink } from 'vue-router'
  import { adminService } from '@/services/api'

  const router = useRouter()
  const form = ref({
    name: '',
    description: ''
  })
  const errors = ref({})
  const generalError = ref('')

  const validate = () => {
    errors.value = {}
    if (!form.value.name) errors.value.name = 'El nombre es obligatorio'
    if (form.value.name && form.value.name.length > 255) errors.value.name = 'El nombre no puede superar 255 caracteres'
    return Object.keys(errors.value).length === 0
  }

  const submit = async () => {
    generalError.value = ''
    if (!validate()) return

    try {
      const res = await adminService.createFeature({
        name: form.value.name,
        description: form.value.description
      })
      const id = res.data.feature.feature_id || res.data.feature_id || res.data.id || res.data.id_feature
      if (id) {
        router.push(`/features/${id}`)
      } else {
        generalError.value = 'No se pudo obtener el ID de la nueva feature'
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else if (error.response?.data?.message) {
        generalError.value = error.response.data.message
      } else {
        generalError.value = 'Error al crear la feature'
      }
    }
  }
</script>