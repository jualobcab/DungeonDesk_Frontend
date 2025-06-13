<template>
  <div class="max-w-2xl mx-auto bg-gray-900 border border-amber-900/30 rounded-lg p-8 mt-8 shadow-lg">
    <h1 class="text-3xl font-medieval text-amber-500 mb-8 text-center">Editar Feature</h1>
    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Nombre</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
          maxlength="255"
        />
        <div v-if="errors.name" class="text-red-400 text-sm mt-1">{{ errors.name }}</div>
      </div>
      <div class="mb-4">
        <label class="block text-amber-300 font-semibold mb-2">Descripción</label>
        <textarea
          v-model="form.description"
          rows="4"
          class="w-full px-3 py-2 rounded bg-gray-800 border border-amber-900/30 text-gray-100"
        ></textarea>
        <div v-if="errors.description" class="text-red-400 text-sm mt-1">{{ errors.description }}</div>
      </div>

      <!-- Clases que aprenden esta feature -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-amber-400 font-medieval mb-2">Clases que la obtienen</h2>
        <ul class="space-y-2">
          <li v-for="cls in feature.classes" :key="'class-' + cls.class_id" class="bg-gray-800 border border-amber-900/20 rounded px-3 py-2 flex items-center gap-3">
            <span class="text-amber-400 font-bold">{{ getClassName(cls.class_id) }}</span>
            <span class="text-gray-300">Lv. 
              <span v-if="editingClassId !== cls.class_id">{{ cls.level }}</span>
              <input
                v-else
                v-model="editClassLevel"
                type="number"
                min="1"
                class="w-16 px-2 py-1 rounded bg-gray-700 border border-amber-900/30 text-gray-100 ml-2"
              />
            </span>
            <button
              v-if="editingClassId !== cls.class_id"
              class="ml-2 px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-bold"
              @click.prevent="startEditClassLevel(cls)"
              title="Editar nivel"
            >Editar</button>
            <button
              v-else
              class="ml-2 px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded font-bold"
              @click.prevent="saveEditClassLevel(cls)"
              title="Guardar nivel"
            >Guardar</button>
            <button
              class="ml-2 px-2 py-1 bg-red-900 hover:bg-red-700 text-white rounded font-bold"
              @click.prevent="removeFeatureFromClass(cls)"
              title="Eliminar de clase"
            >Eliminar</button>
          </li>
        </ul>
        <!-- Añadir a nueva clase -->
        <div class="mt-4 flex items-center gap-2">
          <select v-model="addClass.class_id" class="bg-gray-800 border border-amber-900/30 text-gray-100 rounded px-2 py-1">
            <option value="">Añadir a clase...</option>
            <option v-for="cls in availableClasses" :key="cls.class_id" :value="cls.class_id">
              {{ cls.name }}
            </option>
          </select>
          <input
            v-model="addClass.level"
            type="number"
            min="1"
            placeholder="Nivel"
            class="w-20 px-2 py-1 rounded bg-gray-700 border border-amber-900/30 text-gray-100"
          />
          <button
            class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold"
            @click.prevent="addFeatureToClass"
            :disabled="!addClass.class_id || !addClass.level"
          >Añadir</button>
        </div>
        <div v-if="addClassError" class="text-red-400 text-sm mt-1">{{ addClassError }}</div>
      </div>

      <!-- Subclases que aprenden esta feature -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-purple-400 font-medieval mb-2">Subclases que la obtienen</h2>
        <ul class="space-y-2">
          <li v-for="sub in feature.subclasses" :key="'subclass-' + sub.subclass_id" class="bg-gray-800 border border-purple-900/20 rounded px-3 py-2 flex items-center gap-3">
            <span class="text-purple-300 font-bold">{{ getSubclassName(sub.subclass_id) }}</span>
            <span class="text-gray-300">Lv. 
              <span v-if="editingSubclassId !== sub.subclass_id">{{ sub.level }}</span>
              <input
                v-else
                v-model="editSubclassLevel"
                type="number"
                min="1"
                class="w-16 px-2 py-1 rounded bg-gray-700 border border-amber-900/30 text-gray-100 ml-2"
              />
            </span>
            <button
              v-if="editingSubclassId !== sub.subclass_id"
              class="ml-2 px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-bold"
              @click.prevent="startEditSubclassLevel(sub)"
              title="Editar nivel"
            >Editar</button>
            <button
              v-else
              class="ml-2 px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded font-bold"
              @click.prevent="saveEditSubclassLevel(sub)"
              title="Guardar nivel"
            >Guardar</button>
            <button
              class="ml-2 px-2 py-1 bg-red-900 hover:bg-red-700 text-white rounded font-bold"
              @click.prevent="removeFeatureFromSubclass(sub)"
              title="Eliminar de subclase"
            >Eliminar</button>
          </li>
        </ul>
        <!-- Añadir a nueva subclase -->
        <div class="mt-4 flex items-center gap-2">
          <select v-model="addSubclass.subclass_id" class="bg-gray-800 border border-amber-900/30 text-gray-100 rounded px-2 py-1">
            <option value="">Añadir a subclase...</option>
            <option v-for="sub in availableSubclasses" :key="sub.subclass_id" :value="sub.subclass_id">
              {{ sub.name }} ({{ getClassName(sub.class_id) }})
            </option>
          </select>
          <input
            v-model="addSubclass.level"
            type="number"
            min="1"
            placeholder="Nivel"
            class="w-20 px-2 py-1 rounded bg-gray-700 border border-amber-900/30 text-gray-100"
          />
          <button
            class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold"
            @click.prevent="addFeatureToSubclass"
            :disabled="!addSubclass.subclass_id || !addSubclass.level"
          >Añadir</button>
        </div>
        <div v-if="addSubclassError" class="text-red-400 text-sm mt-1">{{ addSubclassError }}</div>
      </div>

      <div class="flex gap-4 mt-8">
        <button type="submit" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow transition">
          Guardar cambios
        </button>
        <RouterLink to="/features" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold transition">
          Cancelar
        </RouterLink>
      </div>
      <div v-if="successMessage" class="text-green-400 mt-6 text-center font-bold">{{ successMessage }}</div>
      <div v-if="generalError" class="text-red-400 mt-6 text-center font-bold">{{ generalError }}</div>
    </form>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter, RouterLink } from 'vue-router'
  import { adminService, classService } from '@/services/api'

  const route = useRoute()
  const router = useRouter()
  const form = ref({
    name: '',
    description: ''
  })
  const errors = ref({})
  const generalError = ref('')
  const successMessage = ref('')

  const feature = ref({
    feature_id: null,
    name: '',
    description: '',
    classes: [],
    subclasses: []
  })

  const allClasses = ref([])
  const allSubclasses = ref([])

  const editingClassId = ref(null)
  const editClassLevel = ref('')
  const editingSubclassId = ref(null)
  const editSubclassLevel = ref('')

  const addClass = ref({ class_id: '', level: '' })
  const addClassError = ref('')
  const addSubclass = ref({ subclass_id: '', level: '' })
  const addSubclassError = ref('')

  const getClassName = (class_id) => {
    const cls = allClasses.value.find(c => c.class_id == class_id)
    return cls ? cls.name : 'Clase'
  }
  const getSubclassName = (subclass_id) => {
    const sub = allSubclasses.value.find(s => s.subclass_id == subclass_id)
    return sub ? sub.name : 'Subclase'
  }

  // Clases y subclases disponibles para añadir (que no tengan ya la feature)
  const availableClasses = computed(() =>
    allClasses.value.filter(
      c => !feature.value.classes.some(fc => fc.class_id == c.class_id)
    )
  )
  const availableSubclasses = computed(() =>
    allSubclasses.value.filter(
      s => !feature.value.subclasses.some(fs => fs.subclass_id == s.subclass_id)
    )
  )

  const fetchFeature = async () => {
    try {
      const res = await adminService.getFeature(route.params.id)
      feature.value = res.data
      form.value.name = res.data.name
      form.value.description = res.data.description
    } catch (e) {
      router.push('/features')
    }
  }

  const fetchAllClassesAndSubclasses = async () => {
    const [classesRes, subclassesRes] = await Promise.all([
      classService.getAll(),
      // Subclases: para todas las clases, obtener sus subclases
      Promise.all(
        (await classService.getAll()).data.map(cls =>
          classService.getSubclasses(cls.class_id)
        )
      )
    ])
    allClasses.value = classesRes.data
    allSubclasses.value = subclassesRes
      .flatMap(res => res.data)
      .map(sub => ({
        ...sub,
        class_id: sub.class_id
      }))
  }

  onMounted(async () => {
    await fetchFeature()
    await fetchAllClassesAndSubclasses()
  })

  const validate = () => {
    errors.value = {}
    if (!form.value.name) errors.value.name = 'El nombre es obligatorio'
    if (form.value.name && form.value.name.length > 255) errors.value.name = 'El nombre no puede superar 255 caracteres'
    return Object.keys(errors.value).length === 0
  }

  const submit = async () => {
    generalError.value = ''
    successMessage.value = ''
    if (!validate()) return

    try {
      await adminService.updateFeature(feature.value.feature_id, {
        name: form.value.name,
        description: form.value.description
      })
      successMessage.value = '¡Feature actualizada exitosamente!'
      setTimeout(() => {
        router.push('/features')
      }, 1200)
    } catch (error) {
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else if (error.response?.data?.message) {
        generalError.value = error.response.data.message
      } else {
        generalError.value = 'Error al actualizar la feature'
      }
    }
  }

  // Editar nivel de clase
  const startEditClassLevel = (cls) => {
    editingClassId.value = cls.class_id
    editClassLevel.value = cls.level
  }
  const saveEditClassLevel = async (cls) => {
    if (!editClassLevel.value || editClassLevel.value < 1) return
    try {
      await adminService.addFeatureToClass({
        class_id: cls.class_id,
        feature_id: feature.value.feature_id,
        level: editClassLevel.value
      })
      await fetchFeature()
      editingClassId.value = null
      editClassLevel.value = ''
    } catch (e) {
      generalError.value = 'Error al actualizar el nivel'
    }
  }

  // Eliminar feature de clase
  const removeFeatureFromClass = async (cls) => {
    try {
      await adminService.deleteFeatureFromClass({
        class_id: cls.class_id,
        feature_id: feature.value.feature_id
      })
      await fetchFeature()
    } catch (e) {
      generalError.value = 'Error al eliminar la feature de la clase'
    }
  }

  // Añadir feature a clase
  const addFeatureToClass = async () => {
    addClassError.value = ''
    if (!addClass.value.class_id || !addClass.value.level) {
      addClassError.value = 'Debes seleccionar una clase y nivel'
      return
    }
    if (feature.value.classes.some(fc => fc.class_id == addClass.value.class_id)) {
      addClassError.value = 'La clase ya tiene esta feature'
      return
    }
    try {
      await adminService.addFeatureToClass({
        class_id: addClass.value.class_id,
        feature_id: feature.value.feature_id,
        level: addClass.value.level
      })
      await fetchFeature()
      addClass.value = { class_id: '', level: '' }
    } catch (e) {
      addClassError.value = 'Error al añadir la feature a la clase'
    }
  }

  // Editar nivel de subclase
  const startEditSubclassLevel = (sub) => {
    editingSubclassId.value = sub.subclass_id
    editSubclassLevel.value = sub.level
  }
  const saveEditSubclassLevel = async (sub) => {
    if (!editSubclassLevel.value || editSubclassLevel.value < 1) return
    try {
      await adminService.addFeatureToSubclass({
        subclass_id: sub.subclass_id,
        feature_id: feature.value.feature_id,
        level: editSubclassLevel.value
      })
      await fetchFeature()
      editingSubclassId.value = null
      editSubclassLevel.value = ''
    } catch (e) {
      generalError.value = 'Error al actualizar el nivel'
    }
  }

  // Eliminar feature de subclase
  const removeFeatureFromSubclass = async (sub) => {
    try {
      await adminService.deleteFeatureFromClass({
        subclass_id: sub.subclass_id,
        feature_id: feature.value.feature_id
      })
      await fetchFeature()
    } catch (e) {
      generalError.value = 'Error al eliminar la feature de la subclase'
    }
  }

  // Añadir feature a subclase
  const addFeatureToSubclass = async () => {
    addSubclassError.value = ''
    if (!addSubclass.value.subclass_id || !addSubclass.value.level) {
      addSubclassError.value = 'Debes seleccionar una subclase y nivel'
      return
    }
    if (feature.value.subclasses.some(fs => fs.subclass_id == addSubclass.value.subclass_id)) {
      addSubclassError.value = 'La subclase ya tiene esta feature'
      return
    }
    try {
      await adminService.addFeatureToSubclass({
        subclass_id: addSubclass.value.subclass_id,
        feature_id: feature.value.feature_id,
        level: addSubclass.value.level
      })
      await fetchFeature()
      addSubclass.value = { subclass_id: '', level: '' }
    } catch (e) {
      addSubclassError.value = 'Error al añadir la feature a la subclase'
    }
  }
</script>