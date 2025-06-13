<template>
  <div class="max-w-xl mx-auto bg-gray-900 border border-amber-900/30 rounded-lg p-8 mt-8 shadow-lg">
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Create Class</h1>
    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
          maxlength="255"
        />
        <div v-if="errors.name" class="text-red-400 text-sm mt-1">{{ errors.name }}</div>
      </div>
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Description</label>
        <textarea
          v-model="form.description"
          rows="4"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
        ></textarea>
        <div v-if="errors.description" class="text-red-400 text-sm mt-1">{{ errors.description }}</div>
      </div>
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Subclass unlock level</label>
        <input
          v-model="form.subclass_level"
          type="number"
          min="1"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
        />
        <div v-if="errors.subclass_level" class="text-red-400 text-sm mt-1">{{ errors.subclass_level }}</div>
      </div>
      <div class="flex gap-4 mt-6">
        <button type="submit" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition">
          Create class
        </button>
        <RouterLink to="/classes" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold transition">
          Cancel
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
    description: '',
    subclass_level: ''
  })
  const errors = ref({})
  const generalError = ref('')

  const validate = () => {
    errors.value = {}
    if (!form.value.name) errors.value.name = 'Name is required'
    if (form.value.name && form.value.name.length > 255) errors.value.name = 'Name must be at most 255 characters'
    if (!form.value.subclass_level) {
      errors.value.subclass_level = 'Subclass level is required'
    } else if (form.value.subclass_level < 1) {
      errors.value.subclass_level = 'Subclass level must be at least 1'
    }
    return Object.keys(errors.value).length === 0
  }

  const submit = async () => {
    generalError.value = ''
    if (!validate()) return

    try {
      const payload = {
        name: form.value.name,
        description: form.value.description,
        subclass_level: Number(form.value.subclass_level)
      }
      const res = await adminService.createClass(payload)
      const id = res.data.class.class_id || res.data.class_id || res.data.id
      if (id) {
        router.push(`/classes/${id}`)
      } else {
        generalError.value = 'Could not get the new class ID'
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else if (error.response?.data?.message) {
        generalError.value = error.response.data.message
      } else {
        generalError.value = 'Error creating the class'
      }
    }
  }
</script>