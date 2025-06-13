<template>
  <div class="max-w-xl mx-auto bg-gray-900 border border-amber-900/30 rounded-lg p-8 mt-8 shadow-lg">
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Crear Personaje</h1>
    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Nombre</label>
        <input v-model="form.name" type="text" class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100" maxlength="255" />
        <div v-if="errors.name" class="text-red-400 text-sm mt-1">{{ errors.name }}</div>
      </div>
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Campaña</label>
        <select v-model="form.campaign_id" class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100">
          <option value="">Selecciona una campaña</option>
          <option v-for="c in campaigns" :key="c.id_campaign" :value="c.id_campaign">{{ c.name }}</option>
        </select>
        <div v-if="errors.campaign_id" class="text-red-400 text-sm mt-1">{{ errors.campaign_id }}</div>
      </div>
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Clase</label>
        <select v-model="form.class" @change="onClassChange" class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100">
          <option value="">Selecciona una clase</option>
          <option v-for="cls in classes" :key="cls.class_id" :value="cls.class_id">{{ cls.name }}</option>
        </select>
        <div v-if="errors.class" class="text-red-400 text-sm mt-1">{{ errors.class }}</div>
      </div>
      <div class="mb-4" v-if="showSubclassSelect">
        <label class="block text-amber-300 font-semibold mb-2">Subclase</label>
        <select v-model="form.subclass_id" class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100">
          <option value="">Selecciona una subclase</option>
          <option v-for="sub in subclasses" :key="sub.subclass_id" :value="sub.subclass_id">{{ sub.name }}</option>
        </select>
        <div v-if="errors.subclass_id" class="text-red-400 text-sm mt-1">{{ errors.subclass_id }}</div>
      </div>
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Biografía</label>
        <textarea v-model="form.biography" rows="4" class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"></textarea>
        <div v-if="errors.biography" class="text-red-400 text-sm mt-1">{{ errors.biography }}</div>
      </div>
      <div class="flex gap-4 mt-6">
        <button type="submit" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition">
          Crear personaje
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { characterService, classService, campaignService } from '@/services/api'

const router = useRouter()
const form = ref({
  name: '',
  class: '',
  subclass_id: '',
  biography: '',
  campaign_id: ''
})
const errors = ref({})
const generalError = ref('')
const successMessage = ref('')

const classes = ref([])
const subclasses = ref([])
const campaigns = ref([])
const selectedClassObj = computed(() => classes.value.find(cls => cls.class_id == form.value.class))
const showSubclassSelect = computed(() => selectedClassObj.value && selectedClassObj.value.subclass_level == 1)

onMounted(async () => {
  try {
    const [classRes, campaignRes] = await Promise.all([
      classService.getAll(),
      campaignService.getAll()
    ])
    classes.value = classRes.data
    campaigns.value = campaignRes.data
  } catch (e) {
    generalError.value = 'Error cargando datos iniciales'
  }
})

watch(() => form.value.class, async (newVal) => {
  form.value.subclass_id = ''
  if (showSubclassSelect.value) {
    try {
      const res = await classService.getSubclasses(form.value.class)
      subclasses.value = res.data
    } catch (e) {
      subclasses.value = []
    }
  } else {
    subclasses.value = []
  }
})

const validate = () => {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'El nombre es obligatorio'
  if (!form.value.class) errors.value.class = 'La clase es obligatoria'
  if (showSubclassSelect.value && !form.value.subclass_id) errors.value.subclass_id = 'La subclase es obligatoria'
  if (!form.value.campaign_id) errors.value.campaign_id = 'Debes seleccionar una campaña'
  if (form.value.name && form.value.name.length > 255) errors.value.name = 'El nombre no puede superar 255 caracteres'
  return Object.keys(errors.value).length === 0
}

const submit = async () => {
  generalError.value = ''
  successMessage.value = ''
  if (!validate()) return

  try {
    // Crear personaje
    const payload = {
      name: form.value.name,
      class: form.value.class,
      biography: form.value.biography,
      subclass_id: showSubclassSelect.value ? form.value.subclass_id : null,
      campaign_id: form.value.campaign_id
    }
    await characterService.create(payload)
    successMessage.value = '¡Personaje creado exitosamente!'
    setTimeout(() => {
      router.push('/characters')
    }, 1200)
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      generalError.value = error.response.data.message
    } else {
      generalError.value = 'Error al crear el personaje'
    }
  }
}

const onClassChange = () => {
  form.value.subclass_id = ''
}
</script>