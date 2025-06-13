<template>
  <div class="max-w-xl mx-auto bg-gray-900 border border-amber-900/30 rounded-lg p-8 mt-8 shadow-lg">
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Edit Class</h1>
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
        <label class="block text-amber-300 font-semibold mb-2">Subclass unlock level (optional)</label>
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
          Save changes
        </button>
        <RouterLink to="/classes" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold transition">
          Cancel
        </RouterLink>
      </div>
      <div v-if="successMessage" class="text-green-400 mt-6 text-center font-bold">{{ successMessage }}</div>
      <div v-if="generalError" class="text-red-400 mt-6 text-center font-bold">{{ generalError }}</div>
    </form>

    <!-- Subclasses management -->
    <div class="mt-10">
      <h2 class="text-xl font-bold text-amber-400 font-medieval mb-4">Subclasses</h2>
      <ul class="space-y-2 mb-4">
        <li
          v-for="sub in subclasses"
          :key="sub.subclass_id"
          class="bg-gray-800 border border-amber-900/20 rounded px-3 py-2 flex items-center gap-3"
        >
          <span class="text-amber-400 font-bold">{{ sub.name }}</span>
          <span class="text-gray-300">{{ sub.description }}</span>
          <button
            class="ml-auto px-2 py-1 bg-red-900 hover:bg-red-700 text-white rounded font-bold"
            @click="removeSubclass(sub)"
            title="Delete subclass"
          >Delete</button>
        </li>
      </ul>
      <button
        class="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold shadow transition"
        @click="showAddSubclassModal = true"
      >
        Add Subclass
      </button>
    </div>

    <!-- Modal for adding subclass -->
    <div
      v-if="showAddSubclassModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-sm w-full shadow-xl flex flex-col items-center">
        <h3 class="text-xl text-amber-400 font-bold mb-4">Add Subclass</h3>
        <form @submit.prevent="submitSubclass" class="w-full">
          <div class="mb-4">
            <label class="block text-amber-300 font-semibold mb-2">Name</label>
            <input
              v-model="subclassForm.name"
              type="text"
              class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
              maxlength="255"
            />
            <div v-if="subclassErrors.name" class="text-red-400 text-sm mt-1">{{ subclassErrors.name }}</div>
          </div>
          <div class="mb-4">
            <label class="block text-amber-300 font-semibold mb-2">Description</label>
            <textarea
              v-model="subclassForm.description"
              rows="3"
              class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
            ></textarea>
            <div v-if="subclassErrors.description" class="text-red-400 text-sm mt-1">{{ subclassErrors.description }}</div>
          </div>
          <div class="flex gap-4 mt-6">
            <button type="submit" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition">
              Add
            </button>
            <button type="button" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold transition" @click="closeSubclassModal">
              Cancel
            </button>
          </div>
          <div v-if="subclassSuccess" class="text-green-400 mt-4 text-center font-bold">{{ subclassSuccess }}</div>
          <div v-if="subclassGeneralError" class="text-red-400 mt-4 text-center font-bold">{{ subclassGeneralError }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter, RouterLink } from 'vue-router'
  import { adminService, classService } from '@/services/api'

  const route = useRoute()
  const router = useRouter()
  const classId = route.params.id

  const form = ref({
    name: '',
    description: '',
    subclass_level: ''
  })
  const errors = ref({})
  const generalError = ref('')
  const successMessage = ref('')

  const subclasses = ref([])

  // Subclass modal state
  const showAddSubclassModal = ref(false)
  const subclassForm = ref({
    name: '',
    description: ''
  })
  const subclassErrors = ref({})
  const subclassSuccess = ref('')
  const subclassGeneralError = ref('')

  // Cargar datos de la clase y subclases
  onMounted(async () => {
    try {
      const res = await classService.getOne(classId)
      form.value.name = res.data.name
      form.value.description = res.data.description
      form.value.subclass_level = res.data.subclass_level
      // Cargar subclases
      const subRes = await classService.getSubclasses(classId)
      subclasses.value = subRes.data
    } catch (e) {
      generalError.value = 'Error loading class data'
    }
  })

  const validate = () => {
    errors.value = {}
    if (!form.value.name) errors.value.name = 'Name is required'
    if (form.value.name && form.value.name.length > 255) errors.value.name = 'Name must be at most 255 characters'
    if (form.value.subclass_level && form.value.subclass_level < 1) errors.value.subclass_level = 'Subclass level must be at least 1'
    return Object.keys(errors.value).length === 0
  }

  const submit = async () => {
    generalError.value = ''
    successMessage.value = ''
    if (!validate()) return

    try {
      await adminService.updateClass(classId, {
        name: form.value.name,
        description: form.value.description,
        subclass_level: form.value.subclass_level ? Number(form.value.subclass_level) : null
      })
      successMessage.value = 'Class updated successfully!'
      // Recargar subclases si es necesario
      const subRes = await classService.getSubclasses(classId)
      subclasses.value = subRes.data
    } catch (error) {
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else if (error.response?.data?.message) {
        generalError.value = error.response.data.message
      } else {
        generalError.value = 'Error updating the class'
      }
    }
  }

  // Subclass management
  const closeSubclassModal = () => {
    showAddSubclassModal.value = false
    subclassForm.value = { name: '', description: '' }
    subclassErrors.value = {}
    subclassSuccess.value = ''
    subclassGeneralError.value = ''
  }

  const validateSubclass = () => {
    subclassErrors.value = {}
    if (!subclassForm.value.name) subclassErrors.value.name = 'Name is required'
    if (subclassForm.value.name && subclassForm.value.name.length > 255) subclassErrors.value.name = 'Name must be at most 255 characters'
    return Object.keys(subclassErrors.value).length === 0
  }

  const submitSubclass = async () => {
    subclassSuccess.value = ''
    subclassGeneralError.value = ''
    if (!validateSubclass()) return

    try {
      await adminService.createSubclass({
        class_id: classId,
        name: subclassForm.value.name,
        description: subclassForm.value.description
      })
      subclassSuccess.value = 'Subclass created successfully!'
      // Recargar subclases
      const subRes = await classService.getSubclasses(classId)
      subclasses.value = subRes.data
      // Limpiar formulario tras éxito
      setTimeout(() => {
        closeSubclassModal()
      }, 1200)
    } catch (error) {
      if (error.response?.data?.errors) {
        subclassErrors.value = error.response.data.errors
      } else if (error.response?.data?.message) {
        subclassGeneralError.value = error.response.data.message
      } else {
        subclassGeneralError.value = 'Error creating the subclass'
      }
    }
  }

  const removeSubclass = async (sub) => {
    if (!confirm(`Are you sure you want to delete the subclass "${sub.name}"?`)) return
    try {
      await adminService.deleteSubclass(sub.subclass_id)
      subclasses.value = subclasses.value.filter(s => s.subclass_id !== sub.subclass_id)
    } catch (e) {
      console.log('Error deleting the subclass', error)
    }
  }
</script>