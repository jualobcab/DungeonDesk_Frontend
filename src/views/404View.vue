<template>
  <div class="flex items-center justify-center flex-1 min-h-0">
    <div class="bg-gray-900 shadow-lg rounded-lg p-6 w-full max-w-xs border border-amber-900/30 flex flex-col items-center">
      <img
        src="@/assets/img/criticalFailure.png"
        alt="Critical Failure"
        class="w-24 h-24 mb-4 object-contain"
      />
      <h2 class="text-2xl font-medieval font-bold mb-3 text-center text-amber-500">404 - Not Found</h2>
      <p class="text-amber-400 text-center mb-4">
        Oops! The page you are looking for does not exist.<br>
        Maybe you rolled a critical failure...
      </p>
      <router-link
        to="/"
        class="mt-2 bg-amber-700 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-4 rounded transition duration-200 font-medieval"
      >
        Go Home
      </router-link>
    </div>
  </div>
</template>