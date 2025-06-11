<template>
  <div>
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Weapons</h1>
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

    <!-- Listado de Weapons -->
    <div class="bg-gray-900 border border-amber-900/30 rounded-lg p-4 max-w-2xl mx-auto">
      <ul>
        <RouterLink
          v-for="item in paginatedWeapons"
          :key="item.weapon_id"
          :to="`/equipment/weapons/${item.weapon_id}`"
          class="flex items-center gap-4 py-3 border-b border-amber-900/10 last:border-b-0 hover:bg-gray-800 rounded transition cursor-pointer"
        >
          <img
            src="../assets/img/equipmentIcons/weapon.jpg"
            alt="weapon"
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
              Damage:
              <span class="font-semibold text-blue-300">{{ item.damage_die }}</span>
              <span class="ml-1 text-gray-300">{{ item.damage_type }}</span>
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

    const weapons = ref([])
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

    const onImgError = (event) => {
        event.target.src = '/assets/img/equipmentIcons/weapon.jpg'
    }

    // Ordenar alfabéticamente por name
    const sortedWeapons = computed(() =>
        [...weapons.value].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    )

    const totalPages = computed(() => Math.ceil(sortedWeapons.value.length / pageSize))

    const paginatedWeapons = computed(() => {
        const start = (currentPage.value - 1) * pageSize
        return sortedWeapons.value.slice(start, start + pageSize)
    })

    onMounted(async () => {
        try {
            const res = await equipmentService.getWeapons()
            weapons.value = res.data
        } catch (error) {
            console.error('Error loading weapons:', error)
        }
    })
</script>