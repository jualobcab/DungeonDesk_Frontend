<template>
  <div class="max-w-3xl mx-auto">
    <!-- Icono y título -->
    <div class="flex flex-col items-center mb-6">
      <img
        :src="getClassImage(classData.name)"
        :alt="classData.name"
        class="w-28 h-28 object-cover rounded-full border-4 border-amber-700 bg-gray-800 mb-3"
        @error="onImgError"
        v-if="classData.name"
      />
      <h1 class="text-3xl font-medieval text-amber-500 font-bold mb-2">{{ classData.name }}</h1>
    </div>

    <!-- Descripción y nivel de subclase -->
    <div class="bg-gray-900 border border-amber-900/30 rounded-lg p-5 mb-6">
      <p class="text-gray-200 mb-2">{{ classData.description }}</p>
      <div class="text-amber-300 text-sm">
        Subclass unlock level: <span class="font-semibold">{{ classData.subclass_level }}</span>
      </div>
    </div>

    <!-- Subclases -->
    <div v-if="subclasses.length" class="mb-8">
      <h2 class="text-xl font-bold text-amber-400 font-medieval mb-4">Subclasses</h2>
      <div class="flex flex-wrap gap-4">
        <RouterLink
          v-for="sub in subclasses"
          :key="sub.subclass_id"
          :to="`/classes/${classData.class_id}/subclasses/${sub.subclass_id}`"
          class="flex-1 min-w-[220px] max-w-xs bg-gray-950 border border-amber-900/40 rounded-lg shadow p-4 flex flex-col hover:shadow-amber-700/40 transition-shadow duration-200 cursor-pointer hover:bg-gray-900"
        >
          <h3 class="text-lg font-bold text-amber-300 mb-1">{{ sub.name }}</h3>
          <p class="text-gray-200 text-sm">{{ sub.description }}</p>
        </RouterLink>
      </div>
    </div>

    <!-- Features -->
    <div>
      <h2 class="text-xl font-bold text-amber-400 font-medieval mb-4">Class Features</h2>
      <ul class="space-y-4">
        <li
          v-for="feature in features"
          :key="feature.feature_id"
          class="bg-gray-900 border border-amber-900/30 rounded-lg p-4"
        >
          <div class="flex items-center mb-1">
            <span class="text-amber-500 font-semibold mr-2">{{ feature.name }}</span>
            <span class="text-xs text-amber-300 ml-auto">Level: {{ feature.level }}</span>
          </div>
          <div class="text-gray-200 text-sm">{{ feature.description }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { classService } from '@/services/api'

    const route = useRoute()
    const classId = route.params.id

    const classData = ref({})
    const subclasses = ref([])
    const features = ref([])

    const getClassImage = (name) => {
    if (!name) return ''
        const fileName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
        return new URL(`../assets/img/classIcons/${fileName}.jpeg`, import.meta.url).href
    }

    const onImgError = (event) => {
        event.target.src = new URL('../assets/img/classIcons/default.jpeg', import.meta.url).href
    }

    onMounted(async () => {
        try {
            // Datos de la clase y subclases
            const res = await classService.getOne(classId)
            classData.value = res.data
            subclasses.value = res.data.subclasses || []

            // Features de la clase
            const featuresRes = await classService.getFeatures(classId)
            features.value = featuresRes.data
        } catch (error) {
            console.error('Error loading class details:', error)
        }
    })
</script>