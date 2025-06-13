<template>
  <div class="max-w-xl mx-auto bg-gray-900 border border-amber-900/30 rounded-lg p-8 mt-8 shadow-lg">
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Edit Subclass</h1>
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
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter, RouterLink } from 'vue-router'
    import { adminService, classService } from '@/services/api'

    const route = useRoute()
    const router = useRouter()
    const subclassId = route.params.id

    const form = ref({
        name: '',
        description: ''
    })
    const errors = ref({})
    const generalError = ref('')
    const successMessage = ref('')

    onMounted(async () => {
        try {
            // Buscar el class_id de la subclase
            const classesRes = await classService.getAll()
            let found = false
            for (const cls of classesRes.data) {
            const subsRes = await classService.getSubclasses(cls.class_id)
            const sub = subsRes.data.find(s => s.subclass_id == subclassId)
            if (sub) {
                form.value.name = sub.name
                form.value.description = sub.description
                found = true
                break
            }
            }
            if (!found) {
            generalError.value = 'Subclass not found'
            }
        } catch (e) {
            generalError.value = 'Error loading subclass data'
        }
    })

    const validate = () => {
        errors.value = {}
        if (!form.value.name) errors.value.name = 'Name is required'
        if (form.value.name && form.value.name.length > 255) errors.value.name = 'Name must be at most 255 characters'
        return Object.keys(errors.value).length === 0
    }

    const submit = async () => {
        generalError.value = ''
        successMessage.value = ''
        if (!validate()) return

        try {
            await adminService.updateSubclass(subclassId, {
                name: form.value.name,
                description: form.value.description
            })
            successMessage.value = 'Subclass updated successfully!'
            setTimeout(() => {
                router.push(`/subclasses/${subclassId}`)
            }, 1200)
        } catch (error) {
            if (error.response?.data?.errors) {
                errors.value = error.response.data.errors
            } else if (error.response?.data?.message) {
                generalError.value = error.response.data.message
            } else {
                generalError.value = 'Error updating the subclass'
            }
        }
    }
</script>