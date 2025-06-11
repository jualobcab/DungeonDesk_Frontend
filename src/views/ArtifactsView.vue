<template>
  <div>
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Artifacts</h1>
    <!-- Botones de navegación -->
    <div class="flex justify-center gap-4 mb-8">
      <RouterLink
        v-for="btn in buttons"
        :key="btn.name"
        :to="btn.to"
        class="px-5 py-2 rounded-lg font-medieval text-lg border border-amber-900/40 bg-amber-800 text-gray-100 hover:bg-amber-700 hover:text-gray-900 transition-colors duration-200"
        active-class="bg-amber-700 text-gray-900"
      >
        {{ btn.label }}
      </RouterLink>
    </div>

    <!-- Listado de Artifacts -->
    <div class="bg-gray-900 border border-amber-900/30 rounded-lg p-4 max-w-2xl mx-auto">
      <ul>
        <RouterLink
          v-for="item in paginatedArtifacts"
          :key="item.artifact_id"
          :to="`/equipment/artifacts/${item.artifact_id}`"
          class="flex items-center gap-4 py-3 border-b border-amber-900/10 last:border-b-0 hover:bg-gray-800 rounded transition cursor-pointer"
        >
          <img
            :src="getArtifactIcon(item.type)"
            :alt="item.type"
            class="w-12 h-12 object-contain rounded bg-gray-800 border border-amber-900/30"
            @error="onImgError"
          />
          <div class="flex-1">
            <h2 class="text-lg font-bold text-amber-400 font-medieval">{{ item.name }}</h2>
            <div class="text-xs mb-1">
              <span class="font-semibold text-amber-300">Type:</span>
              <span class="ml-1 text-gray-200">{{ item.type }}</span>
            </div>
            <div class="text-xs mb-1">
              Rarity:
              <span :class="rarityClass(item.rarity)" class="font-semibold">
                {{ item.rarity }}
              </span>
            </div>
            <p class="text-gray-200 text-sm">{{ item.description }}</p>
          </div>
        </RouterLink>
      </ul>

      <!-- Paginación -->
      <div class="flex justify-center mt-6 gap-2">
        <button
          class="px-3 py-1 rounded bg-gray-800 border border-amber-900/30 text-amber-400 hover:bg-amber-700 hover:text-gray-900 transition"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Prev
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 rounded border transition',
            currentPage === page
              ? 'bg-amber-700 text-gray-900 border-amber-700 font-bold'
              : 'bg-gray-800 text-amber-400 border-amber-900/30 hover:bg-amber-700 hover:text-gray-900'
          ]"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1 rounded bg-gray-800 border border-amber-900/30 text-amber-400 hover:bg-amber-700 hover:text-gray-900 transition"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { equipmentService } from '@/services/api'
    import { RouterLink } from 'vue-router'

    const buttons = [
        { name: 'armors', label: 'Armors', to: '/equipment/armors' },
        { name: 'weapons', label: 'Weapons', to: '/equipment/weapons' },
        { name: 'artifacts', label: 'Artifacts', to: '/equipment/artifacts' }
    ]

    const artifacts = ref([])
    const currentPage = ref(1)
    const pageSize = 10

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

    const getArtifactIcon = (type) => {
        if (!type) return ''
        const fileName = type.toLowerCase().replace(/\s+/g, '-')
        return new URL(`../assets/img/equipmentIcons/${fileName}.jpg`, import.meta.url).href
    }

    const onImgError = (event) => {
        event.target.src = new URL('../assets/img/equipmentIcons/default.jpg', import.meta.url).href
    }

    // Ordenar alfabéticamente por name
    const sortedArtifacts = computed(() =>
        [...artifacts.value].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    )

    const totalPages = computed(() => Math.ceil(sortedArtifacts.value.length / pageSize))

    const paginatedArtifacts = computed(() => {
        const start = (currentPage.value - 1) * pageSize
        return sortedArtifacts.value.slice(start, start + pageSize)
    })

    onMounted(async () => {
        try {
            const res = await equipmentService.getArtifacts()
            artifacts.value = res.data
        } catch (error) {
            console.error('Error loading artifacts:', error)
        }
    })
</script>