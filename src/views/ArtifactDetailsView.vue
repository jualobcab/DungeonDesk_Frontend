<template>
  <div>
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Artifact Details</h1>
    <div class="flex flex-col items-center bg-gray-900 border border-amber-900/30 rounded-lg p-8 max-w-xl mx-auto">
      <img
        :src="getArtifactImg(artifact.type)"
        :alt="artifact.type"
        class="w-28 h-28 object-contain rounded bg-gray-800 border border-amber-900/30 mb-6"
        @error="onImgError"
      />
      <h2 class="text-2xl font-bold text-amber-400 font-medieval mb-2">{{ artifact.name }}</h2>
      <div class="text-sm text-gray-300 mb-2">
        <span class="font-semibold text-amber-300">Type:</span>
        <span class="ml-1">{{ artifact.type }}</span>
      </div>
      <div class="text-sm text-gray-300 mb-2">
        <span class="font-semibold text-amber-300">Rarity:</span>
        <span :class="rarityClass(artifact.rarity)" class="font-semibold ml-1">{{ artifact.rarity }}</span>
      </div>
      <p class="text-gray-200 text-base mt-4">{{ artifact.description }}</p>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { equipmentService } from '@/services/api'

    const route = useRoute()
    const artifact = ref({})

    const rarityClass = (rarity) => {
        switch ((rarity || '').toLowerCase()) {
            case 'common':
                return 'text-gray-300'
            case 'uncommon':
                return 'text-green-400'
            case 'rare':
                return 'text-blue-400'
            case 'very rare':
                return 'text-purple-400'
            case 'legendary':
                return 'text-yellow-400'
            case 'artifact':
                return 'text-amber-500'
            default:
                return 'text-gray-200'
        }
    }

    const getArtifactImg = (type) => {
        if (!type) return new URL('../assets/img/equipmentIcons/default.jpg', import.meta.url).href
        const fileName = type.toLowerCase().replace(/\s+/g, '-')
        return new URL(`../assets/img/equipmentIcons/${fileName}.jpg`, import.meta.url).href
    }

    const onImgError = (event) => {
        event.target.src = new URL('../assets/img/equipmentIcons/default.jpg', import.meta.url).href
    }

    onMounted(async () => {
        try {
            const res = await equipmentService.getArtifact(route.params.id)
            artifact.value = res.data
        } catch (error) {
            console.error('Error loading artifact:', error)
        }
    })
</script>