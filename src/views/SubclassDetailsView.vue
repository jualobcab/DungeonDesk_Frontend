<template>
  <div class="max-w-2xl mx-auto">
    <!-- Icono y título -->
    <div class="flex flex-col items-center mb-6">
      <img
        :src="getClassImage(className)"
        :alt="className"
        class="w-28 h-28 object-cover rounded-full border-4 border-amber-700 bg-gray-800 mb-3"
        @error="onImgError"
        v-if="className"
      />
      <h1 class="text-3xl font-medieval text-amber-500 font-bold mb-2">{{ subclass.name }}</h1>
    </div>

    <!-- Descripción -->
    <div class="bg-gray-900 border border-amber-900/30 rounded-lg p-5 mb-6">
      <p class="text-gray-200">{{ subclass.description }}</p>
    </div>

    <!-- Features -->
    <div>
      <h2 class="text-xl font-bold text-amber-400 font-medieval mb-4">Subclass Features</h2>
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
    const subclassId = route.params.subclassId

    const subclass = ref({})
    const features = ref([])
    const className = ref('')

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
            // Datos de la subclase
            const res = await classService.getSubclass(classId, subclassId)
            subclass.value = res.data

            // Obtener el nombre de la clase usando el class_id
            const classRes = await classService.getOne(res.data.class_id)
            className.value = classRes.data.name

            // Features de la subclase
            const featuresRes = await classService.getSubclassFeatures(classId, subclassId)
            features.value = featuresRes.data
        } catch (error) {
            console.error('Error loading subclass details:', error)
        }
    })
</script>