<template>
  <div class="max-w-xl mx-auto bg-gray-900 border border-amber-900/30 rounded-lg p-8 mt-8 shadow-lg">
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Create Equipment</h1>
    <form @submit.prevent="submit">
      <!-- Tipo de equipment -->
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Type</label>
        <select
          v-model="form.type"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
        >
          <option value="">Select type</option>
          <option value="armor">Armor</option>
          <option value="weapon">Weapon</option>
          <option value="artifact">Artifact</option>
        </select>
        <div v-if="errors.type" class="text-red-400 text-sm mt-1">{{ errors.type }}</div>
      </div>
      <!-- Nombre -->
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
      <!-- Rareza -->
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Rarity</label>
        <select
          v-model="form.rarity"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
        >
          <option value="">Select rarity</option>
          <option v-for="r in rarities" :key="r" :value="r">{{ r }}</option>
        </select>
        <div v-if="errors.rarity" class="text-red-400 text-sm mt-1">{{ errors.rarity }}</div>
      </div>
      <!-- Descripción -->
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Description</label>
        <textarea
          v-model="form.description"
          rows="4"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
        ></textarea>
        <div v-if="errors.description" class="text-red-400 text-sm mt-1">{{ errors.description }}</div>
      </div>

      <!-- Campos específicos según el tipo -->
      <template v-if="form.type === 'armor'">
        <div class="mb-4">
          <label class="block text-amber-300 font-semibold mb-2">Armor Type</label>
          <select
            v-model="form.armor_type"
            class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
          >
            <option value="">Select armor type</option>
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Heavy">Heavy</option>
          </select>
          <div v-if="errors.armor_type" class="text-red-400 text-sm mt-1">{{ errors.armor_type }}</div>
        </div>
        <div class="mb-4">
          <label class="block text-amber-300 font-semibold mb-2">Armor Class</label>
          <input
            v-model="form.armor_class"
            type="number"
            min="1"
            class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
          />
          <div v-if="errors.armor_class" class="text-red-400 text-sm mt-1">{{ errors.armor_class }}</div>
        </div>
      </template>
      <template v-else-if="form.type === 'weapon'">
        <div class="mb-4">
          <label class="block text-amber-300 font-semibold mb-2">Weapon Type</label>
          <select
            v-model="form.weapon_type"
            class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
          >
            <option value="">Select weapon type</option>
            <option value="Melee">Melee</option>
            <option value="Ranged">Ranged</option>
          </select>
          <div v-if="errors.weapon_type" class="text-red-400 text-sm mt-1">{{ errors.weapon_type }}</div>
        </div>
        <div class="mb-4 flex items-center gap-2">
          <div class="flex-1">
            <label class="block text-amber-300 font-semibold mb-2">Damage Die</label>
            <input
              v-model="damageDieNumber"
              type="number"
              min="1"
              class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
              placeholder="Number"
            />
          </div>
          <div class="w-28">
            <label class="block text-amber-300 font-semibold mb-2 invisible">Die</label>
            <select
              v-model="damageDieType"
              class="w-full px-2 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
            >
              <option v-for="die in dieTypes" :key="die" :value="die">{{ die }}</option>
            </select>
          </div>
        </div>
        <div v-if="errors.damage_die" class="text-red-400 text-sm mt-1">{{ errors.damage_die }}</div>
        <div class="mb-4">
          <label class="block text-amber-300 font-semibold mb-2">Damage Type</label>
          <input
            v-model="form.damage_type"
            type="text"
            class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
            maxlength="50"
          />
          <div v-if="errors.damage_type" class="text-red-400 text-sm mt-1">{{ errors.damage_type }}</div>
        </div>
      </template>
      <template v-else-if="form.type === 'artifact'">
        <div class="mb-4">
          <label class="block text-amber-300 font-semibold mb-2">Artifact Type</label>
          <select
            v-model="form.artifact_type"
            class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
          >
            <option value="">Select artifact type</option>
            <option value="Wondrous Item">Wondrous Item</option>
            <option value="Magic Focus">Magic Focus</option>
          </select>
          <div v-if="errors.artifact_type" class="text-red-400 text-sm mt-1">{{ errors.artifact_type }}</div>
        </div>
      </template>

      <div class="flex gap-4 mt-6">
        <button type="submit" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition">
          Create equipment
        </button>
        <RouterLink to="/equipment" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold transition">
          Cancel
        </RouterLink>
      </div>
      <div v-if="successMessage" class="text-green-400 mt-6 text-center font-bold">{{ successMessage }}</div>
      <div v-if="generalError" class="text-red-400 mt-6 text-center font-bold">{{ generalError }}</div>
    </form>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useRouter, RouterLink } from 'vue-router'
  import { adminService } from '@/services/api'

  const router = useRouter()
  const rarities = [
    'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Woundrous'
  ]
  const armorTypes = ['Light', 'Medium', 'Heavy']
  const weaponTypes = ['Melee', 'Ranged']
  const artifactTypes = ['Wondrous Item', 'Magic Focus']
  const dieTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20']

  const form = ref({
    type: '',
    name: '',
    rarity: '',
    description: '',
    // Armor
    armor_type: '',
    armor_class: '',
    // Weapon
    weapon_type: '',
    damage_die: '',
    damage_type: '',
    // Artifact
    artifact_type: ''
  })
  const errors = ref({})
  const generalError = ref('')
  const successMessage = ref('')

  // Para el damage die de weapon
  const damageDieNumber = ref('')
  const damageDieType = ref('d6')

  // Sincroniza damage_die con los selects
  watch([damageDieNumber, damageDieType], () => {
    if (form.value.type === 'weapon') {
      form.value.damage_die = damageDieNumber.value && damageDieType.value
      ? `${damageDieNumber.value}${damageDieType.value}`
      : ''
    }
  })

  // Si cambia el tipo, limpia los campos específicos
  watch(() => form.value.type, (newType) => {
    form.value.armor_type = ''
    form.value.armor_class = ''
    form.value.weapon_type = ''
    form.value.damage_die = ''
    form.value.damage_type = ''
    form.value.artifact_type = ''
    damageDieNumber.value = ''
    damageDieType.value = 'd6'
  })

  const validate = () => {
    errors.value = {}
    // General
    if (!form.value.type) errors.value.type = 'Type is required'
    if (!form.value.name) errors.value.name = 'Name is required'
    if (form.value.name && form.value.name.length > 255) errors.value.name = 'Name must be at most 255 characters'
    if (!form.value.rarity) errors.value.rarity = 'Rarity is required'
    else if (!rarities.includes(form.value.rarity)) errors.value.rarity = 'Invalid rarity'
    // Campos específicos
    if (form.value.type === 'armor') {
      if (!form.value.armor_type) errors.value.armor_type = 'Armor type is required'
      else if (!armorTypes.includes(form.value.armor_type)) errors.value.armor_type = 'Invalid armor type'
      if (!form.value.armor_class) errors.value.armor_class = 'Armor class is required'
      else if (form.value.armor_class < 1) errors.value.armor_class = 'Armor class must be at least 1'
    }
    if (form.value.type === 'weapon') {
      if (!form.value.weapon_type) errors.value.weapon_type = 'Weapon type is required'
      else if (!weaponTypes.includes(form.value.weapon_type)) errors.value.weapon_type = 'Invalid weapon type'
      if (!damageDieNumber.value || !damageDieType.value) errors.value.damage_die = 'Damage die is required'
      if (!form.value.damage_type) errors.value.damage_type = 'Damage type is required'
    }
    if (form.value.type === 'artifact') {
      if (!form.value.artifact_type) errors.value.artifact_type = 'Artifact type is required'
      else if (!artifactTypes.includes(form.value.artifact_type)) errors.value.artifact_type = 'Invalid artifact type'
    }
    return Object.keys(errors.value).length === 0
  }

  const submit = async () => {
    generalError.value = ''
    successMessage.value = ''
    if (!validate()) return

    try {
      let equipmentPayload = {
        name: form.value.name,
        rarity: form.value.rarity,
        description: form.value.description,
        type: form.value.type
      }
      let equipmentRes = null
      let id = null

      // Primero crea el equipment y luego el tipo específico
      if (form.value.type === 'armor') {
        equipmentRes = await adminService.createArmor({
          ...equipmentPayload,
          type: form.value.armor_type,
          armor_class: Number(form.value.armor_class)
        })
        id = equipmentRes.data.armor?.armor_id || equipmentRes.data.equipment?.equipment_id
      } else if (form.value.type === 'weapon') {
        equipmentRes = await adminService.createWeapon({
          ...equipmentPayload,
          type: form.value.weapon_type,
          damage_die: form.value.damage_die,
          damage_type: form.value.damage_type
        })
        id = equipmentRes.data.weapon?.weapon_id || equipmentRes.data.equipment?.equipment_id
      } else if (form.value.type === 'artifact') {
        equipmentRes = await adminService.createArtifact({
          ...equipmentPayload,
          type: form.value.artifact_type
        })
        id = equipmentRes.data.artifact?.artifact_id || equipmentRes.data.equipment?.equipment_id
      } else {
        equipmentRes = await adminService.createEquipment(equipmentPayload)
        id = equipmentRes.data.equipment?.equipment_id
      }

      if (id) {
        successMessage.value = 'Equipment created successfully!'
        setTimeout(() => {
          router.push('/equipment')
        }, 1200)
      } else {
        generalError.value = 'Could not get the new equipment ID'
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else if (error.response?.data?.message) {
        generalError.value = error.response.data.message
      } else {
        generalError.value = 'Error creating the equipment'
      }
    }
  }
</script>