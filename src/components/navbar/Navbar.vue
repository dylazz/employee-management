<script setup lang="ts">
import {RouterLink} from 'vue-router'
import {ref} from 'vue'

const isMenuOpen = ref(false)
const loggedInUser = 'DylanAz'
</script>

<template>
  <nav class="bg-gray-800 p-3">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
      <div class="text-white text-xl font-bold">
        Employee Management
      </div>
      <!-- Mobile hamburger Button -->
      <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden text-gray-400 hover:text-white"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
              :class="{ 'hidden': isMenuOpen }"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
          />
          <path
              :class="{ 'hidden': !isMenuOpen }"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <!-- Navigation Links-->
      <div
          :class="{ 'hidden': !isMenuOpen }"
          class="w-full md:flex md:w-auto md:items-center justify-between"
      >
        <RouterLink
            to="/"
            class="block mt-4 md:mt-0 md:ml-4 text-gray-300 hover:text-white ease-in-out"
            active-class="text-white"
        >
          Home
        </RouterLink>

        <RouterLink
            to="/"
            class="block mt-4 md:mt-0 md:ml-4 text-gray-300 hover:text-white"
            active-class="text-white"
        >
          About
        </RouterLink>

        <RouterLink
            to="/"
            class="block mt-4 md:mt-0 md:ml-4 text-gray-300 hover:text-white"
            active-class="text-white"
        >
          Contact
        </RouterLink>

        <!-- Logged in user badge -->
        <div class="flex items-center mt-4 md:mt-0 md:ml-4">
          <div class="bg-gray-700 px-3 py-2 rounded-full flex items-center">
            <div class="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
              <span class="text-white text-sm font-medium">
                {{ loggedInUser.charAt(0).toUpperCase() }}
              </span>
            </div>
            <span class="text-gray-300 text-sm">
              {{ loggedInUser }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>