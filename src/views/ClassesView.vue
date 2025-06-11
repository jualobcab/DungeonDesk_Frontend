<template>
  <div>
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">DnD Classes</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <RouterLink
        v-for="classItem in classes"
        :key="classItem.class_id"
        :to="`/classes/${classItem.class_id}`"
        class="bg-gray-900 border border-amber-900/30 rounded-lg shadow-lg p-5 flex flex-col items-center hover:shadow-amber-700/40 transition-shadow duration-200 cursor-pointer"
      >
        <img
          :src="getClassImage(classItem.name)"
          :alt="classItem.name"
          class="w-24 h-24 object-cover rounded-full border-4 border-amber-700 mb-4 bg-gray-800"
          @error="onImgError"
        />
        <h2 class="text-xl font-bold text-amber-400 font-medieval mb-2">{{ classItem.name }}</h2>
        <p class="text-gray-200 text-center mb-2">{{ classItem.description }}</p>
        <div class="text-xs text-amber-300 mt-auto">
          Subclass unlock level: <span class="font-semibold">{{ classItem.subclass_level }}</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { classService } from '@/services/api'
import { RouterLink } from 'vue-router'

    const classes = ref([])

    const getClassImage = (name) => {
    // Lowercase, remove spaces and special chars for file name
    const fileName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    return new URL(`../assets/img/classIcons/${fileName}.jpeg`, import.meta.url).href
    }

    const onImgError = (event) => {
    event.target.src = new URL('../assets/img/classIcons/default.jpeg', import.meta.url).href
    }

    onMounted(async () => {
    try {
        const response = await classService.getAll()
        classes.value = response.data
    } catch (error) {
        console.error('Error loading classes:', error)
    }
    })
</script>