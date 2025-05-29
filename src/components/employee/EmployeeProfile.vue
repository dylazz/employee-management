<script setup lang="ts">
import {ref} from "vue";
import {useRoute} from "vue-router";
import {employees} from "../../utils/employeeData.ts";
import router from "../../router";

const route = useRoute();

// Searching the employee array for one that matches the route parameter
const employee = ref(employees.find(emp => emp.id === Number(route.params.id)));

const goBack = () => {
  router.back();
};
</script>

<template>
  <div v-if="employee" class="p-6 max-w-2xl mx-auto">

    <button
        @click="goBack"
        class="mb-6 flex items-center text-black-600 hover:text-black-800 transition-colors"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 24 24"
          stroke="black"
          fill="none"
      >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to List
    </button>

    <h1 class="text-2xl font-bold mb-6">{{ employee.fullName }}</h1>
    <div class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h2 class="text-gray-500">Occupation</h2>
          <p class="font-medium">{{ employee.occupation }}</p>
        </div>
        <div>
          <h2 class="text-gray-500">Department</h2>
          <p class="font-medium">{{ employee.department }}</p>
        </div>
        <div>
          <h2 class="text-gray-500">Date of Employment</h2>
          <p class="font-medium">{{ employee.dateOfEmployment }}</p>
        </div>
        <div>
          <h2 class="text-gray-500">Termination Date</h2>
          <p class="font-medium">{{ employee.terminationDate || 'N/A' }}</p>
        </div>
      </div>
    </div>
  </div>

</template>