<template>
  <div class="max-w-xl mx-auto bg-gray-900 border border-amber-900/30 rounded-lg p-8 mt-8 shadow-lg">
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Editar Personaje</h1>
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
        <label class="block text-amber-300 font-semibold mb-2">Campaña</label>
        <input
          type="text"
          :value="character.campaign_name"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-400"
          disabled
        />
      </div>
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Clase(s)</label>
        <div
          v-for="cls in character.classes"
          :key="cls.class_id + '-' + (cls.subclass_id || '')"
          class="flex items-center gap-2 mb-1"
        >
          <span class="text-amber-400 font-bold">{{ cls.class_name }}</span>
          <span class="text-gray-300">Lv. {{ cls.level }}</span>
          <span v-if="cls.subclass_name" class="ml-2 text-amber-300">({{ cls.subclass_name }})</span>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Nivel</label>
        <input
          type="text"
          :value="character.level"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-400"
          disabled
        />
      </div>
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Biografía</label>
        <textarea
          v-model="form.biography"
          rows="4"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
        ></textarea>
        <div v-if="errors.biography" class="text-red-400 text-sm mt-1">{{ errors.biography }}</div>
      </div>
      <div class="flex gap-4 mt-6">
        <button type="submit" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition">
          Guardar cambios
        </button>
        <RouterLink to="/characters" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold transition">
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
    import { characterService } from '@/services/api'

    const route = useRoute()
    const router = useRouter()
    const character = ref({
        name: '',
        campaign_name: '',
        classes: [],
        level: '',
        biography: ''
    })
    const form = ref({
        name: '',
        biography: ''
    })
    const errors = ref({})
    const generalError = ref('')
    const successMessage = ref('')

    onMounted(async () => {
        try {
            const res = await characterService.getOne(route.params.id)
            if (!res.data || !res.data.id_character) {
                router.push('/characters')
                return
            }
            character.value = res.data
            form.value.name = res.data.name
            form.value.biography = res.data.biography
        } catch (e) {
            router.push('/characters')
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
            await characterService.update(route.params.id, {
                name: form.value.name,
                biography: form.value.biography
            })
            successMessage.value = '¡Personaje actualizado exitosamente!'
            setTimeout(() => {
                router.push('/characters')
            }, 1200)
        } catch (error) {
            if (error.response?.data?.errors) {
                errors.value = error.response.data.errors
            } else if (error.response?.data?.message) {
                generalError.value = error.response.data.message
            } else {
                generalError.value = 'Error al actualizar el personaje'
            }
        }
    }
</script>