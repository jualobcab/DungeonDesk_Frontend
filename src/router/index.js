import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { watch } from 'vue';

const routes = [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/logout',
      name: 'Logout',
      component: () => import('../views/LogoutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/characters',
      name: 'Characters',
      component: () => import('../views/CharactersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/characters/create',
      name: 'CharacterCreation',
      component: () => import('../views/CharactersCreationView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/characters/:id',
      name: 'Character',
      component: () => import('../views/CharacterDetailsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/characters/:id/edit',
      name: 'CharacterUpdate',
      component: () => import('../views/CharacterDetailsUpdateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/classes',
      name: 'Classes',
      component: () => import('../views/ClassesView.vue')
    },
    {
      path: '/classes/:id',
      name: 'ClassDetail',
      component: () => import('../views/ClassDetailsView.vue'),
    },
    {
      path: '/classes/:id/subclasses/:subclassId',
      name: 'SubclassDetail',
      component: () => import('../views/SubclassDetailsView.vue'),
    },
    {
      path: '/equipment',
      name: 'Equipment',
      component: () => import('../views/EquipmentView.vue')
    },
    {
      path: '/equipment/armors',
      name: 'Armors',
      component: () => import('../views/ArmorsView.vue')
    },
    {
      path: '/equipment/armors/:id',
      name: 'Armor',
      component: () => import('../views/ArmorDetailsView.vue')
    },
    {
      path: '/equipment/artifacts',
      name: 'Artifacts',
      component: () => import('../views/ArtifactsView.vue')
    },
    {
      path: '/equipment/artifacts/:id',
      name: 'Artifact',
      component: () => import('../views/ArtifactDetailsView.vue')
    },
    {
      path: '/equipment/weapons',
      name: 'Weapons',
      component: () => import('../views/WeaponsView.vue')
    },
    {
      path: '/equipment/weapons/:id',
      name: 'Weapon',
      component: () => import('../views/WeaponDetailsView.vue')
    },
    {
      path: '/campaigns',
      name: 'Campaigns',
      component: () => import('../views/CampaignsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/campaigns/create',
      name: 'CampaignCreation',
      component: () => import('../views/CampaignCreationView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/campaigns/:id',
      name: 'CampaignDetails',
      component: () => import('../views/CampaignDetailsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/campaigns/:id/edit',
      name: 'CampaignUpdate',
      component: () => import('../views/CampaignDetailsUpdateView.vue'),
      meta: { requiresAuth: true }
    },

    // Admin routes
    {
      path: '/features',
      name: 'Features',
      component: () => import('../views/FeaturesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/features/:id',
      name: 'FeatureDetails',
      component: () => import('../views/FeatureDetailsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/features/create',
      name: 'FeatureCreation',
      component: () => import('../views/FeatureCreationView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/features/:id/edit',
      name: 'FeatureUpdate',
      component: () => import('../views/FeatureUpdateView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/classes/create',
      name: 'ClassCreation',
      component: () => import('../views/ClassesCreationView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/classes/:id/edit',
      name: 'ClassUpdate',
      component: () => import('../views/ClassUpdateView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/subclasses/:id/edit',
      name: 'SubclassUpdate',
      component: () => import('../views/SubclassUpdateView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/equipment/create',
      name: 'EquipmentCreation',
      component: () => import('../views/EquipmentCreationView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/equipment/:id/edit',
      name: 'EquipmentUpdate',
      component: () => import('../views/EquipmentUpdateView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },

    // Catch-all route for 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/404View.vue'),
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Wait until auth loading is finished
  if (authStore.isAuthLoading) {
    // Create a promise that resolves when isAuthLoading becomes false
    await new Promise((resolve) => {
      const unwatch = watch(
        () => authStore.isAuthLoading,
        (newVal) => {
          if (!newVal) {
            unwatch()
            resolve()
          }
        },
        { immediate: true }, // Check immediately in case it's already false
      )
    })
  }

  // Now proceed with navigation after auth is loaded
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuth && !authStore.token) {
    // If route requires auth and user is not authenticated
    next('/login')
  } else if (requiresAdmin && (!authStore.user || authStore.user.role !== "admin")) {
    // If route requires admin and user is not admin
    next('/')
  } else {
    next()
  }
})

export default router