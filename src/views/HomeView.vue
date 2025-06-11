<template>
  <div class="flex items-center justify-center flex-1 min-h-0">
    <div class="bg-gray-900 shadow-lg rounded-lg p-8 w-full max-w-2xl border border-amber-900/30">
      <h1 class="text-3xl font-medieval font-bold mb-4 text-center text-amber-500">Welcome to Dungeon Desk</h1>
      <p class="text-amber-400 text-center mb-6">
        Dungeon Desk is your all-in-one tool for managing your tabletop RPG adventures. Create, organize, and enhance your campaigns and characters with ease.
      </p>
      <ul class="mb-6 space-y-3 text-gray-100">
        <li>
          <span class="text-amber-500 font-bold">🗡️ Equipment:</span>
          Browse and manage weapons, armors, and artifacts for your characters.
        </li>
        <li>
          <span class="text-amber-500 font-bold">📚 Classes & Features:</span>
          Explore all available classes, subclasses, and their unique features.
        </li>
        <li>
          <span class="text-amber-500 font-bold">🧙‍♂️ Characters:</span>
          Create, update, and level up your characters. Equip them and manage their inventory.
        </li>
        <li>
          <span class="text-amber-500 font-bold">🏰 Campaigns:</span>
          Organize your campaigns, manage participants, and keep a campaign diary.
        </li>
        <li>
          <span class="text-amber-500 font-bold">📖 Campaign Diary:</span>
          Record and update campaign events, notes, and important moments.
        </li>
        <li>
          <span class="text-amber-500 font-bold">🔒 Authentication:</span>
          Register, log in, and securely manage your account.
        </li>
      </ul>
      <div class="text-center">
        <router-link
          v-if="!authStore.user"
          to="/register"
          class="bg-amber-700 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-6 rounded transition duration-200 font-medieval"
        >
          Get Started
        </router-link>
        <router-link
          v-else
          to="/characters"
          class="bg-amber-700 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-6 rounded transition duration-200 font-medieval"
        >
          Go to your Characters
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>