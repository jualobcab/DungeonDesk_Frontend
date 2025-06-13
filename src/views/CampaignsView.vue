<template>
  <div>
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Campaigns</h1>
    <div class="flex flex-wrap gap-6 justify-center">
      <RouterLink
        v-for="campaign in campaigns"
        :key="campaign.id_campaign"
        :to="`/campaigns/${campaign.id_campaign}`"
        class="relative block w-full max-w-xs bg-gray-900 border border-amber-900/30 rounded-lg shadow-lg p-6 transition-colors duration-200 cursor-pointer hover:bg-blue-800 hover:border-blue-400 hover:shadow-2xl"
      >
        <!-- Botón de papelera -->
        <button
          class="absolute top-2 right-2 z-10 bg-red-900 hover:bg-red-700 text-gray-100 rounded-full p-2 transition"
          @click.stop.prevent="openDeleteModal(campaign)"
          title="Borrar campaña"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-amber-400 font-medieval mb-2">{{ campaign.name }}</h2>
        <div class="text-gray-300 mb-1">
          <span class="font-semibold text-amber-300">Miembros:</span>
          <span class="ml-1">{{ campaign.members_count }}</span>
        </div>
        <div class="text-gray-300 mb-1">
          <span class="font-semibold text-amber-300">Descripción:</span>
          <span class="ml-1">{{ campaign.description || 'Sin descripción' }}</span>
        </div>
      </RouterLink>
    </div>

    <!-- Botón para añadir campaña -->
    <div v-if="campaigns.length > 0" class="flex justify-center mt-8">
      <RouterLink
        to="/campaigns/create"
        class="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition"
      >
        Añadir campaña
      </RouterLink>
    </div>

    <!-- MENSAJE SI NO HAY CAMPAÑAS -->
    <div v-if="campaigns.length === 0" class="flex flex-col items-center mt-12">
      <p class="text-lg text-gray-200 mb-4 text-center">
        Todavía no tienes ninguna campaña creada.<br>
        ¡Puedes crear una fácilmente!
      </p>
      <RouterLink
        to="/campaigns/create"
        class="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition"
      >
        Crear campaña
      </RouterLink>
    </div>

    <!-- Modal de confirmación de borrado -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div class="bg-gray-900 border border-amber-900/40 rounded-lg p-8 max-w-sm w-full shadow-xl flex flex-col items-center">
        <p class="text-lg text-gray-100 mb-6 text-center">
          ¿Seguro que quieres borrar la campaña <span class="text-amber-400 font-bold">{{ campaignToDelete?.name }}</span>?
        </p>
        <div class="flex gap-4">
          <button
            class="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold"
            @click="confirmDelete"
          >
            Sí, seguro
          </button>
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg"
            @click="showDeleteModal = false"
          >
            No quiero
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { campaignService } from '@/services/api'
    import { RouterLink } from 'vue-router'

    const campaigns = ref([])
    const showDeleteModal = ref(false)
    const campaignToDelete = ref(null)

    const openDeleteModal = (campaign) => {
        campaignToDelete.value = campaign
        showDeleteModal.value = true
    }

    const confirmDelete = async () => {
        if (!campaignToDelete.value) return
        try {
            await campaignService.delete(campaignToDelete.value.id_campaign)
            // Elimina la campaña del array local sin recargar toda la página
            campaigns.value = campaigns.value.filter(
            c => c.id_campaign !== campaignToDelete.value.id_campaign
            )
            showDeleteModal.value = false
            campaignToDelete.value = null
        } catch (error) {
            alert('Error al borrar la campaña')
            showDeleteModal.value = false
            campaignToDelete.value = null
        }
    }

    onMounted(async () => {
        try {
            const res = await campaignService.getAll()
            campaigns.value = res.data
        } catch (error) {
            console.error('Error loading campaigns:', error)
        }
    })
</script>