<script setup lang="ts">
import type {Employee} from "../../types/employee";

defineProps<{
  employee: Employee;
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);

const onClose = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" @click.self="onClose" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header with close button -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Employee Profile</h2>
        <button @click="onClose" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- Employee details -->
      <div class="space-y-4">
        <div>
          <h3 class="font-semibold">Full Name</h3>
          <p>{{ employee.fullName }}</p>
        </div>
        <div>
          <h3 class="font-semibold">Occupation</h3>
          <p>{{ employee.occupation }}</p>
        </div>
        <div>
          <h3 class="font-semibold">Department</h3>
          <p>{{ employee.department }}</p>
        </div>
        <div>
          <h3 class="font-semibold">Date of Employment</h3>
          <p>{{ employee.dateOfEmployment }}</p>
        </div>
        <div v-if="employee.terminationDate">
          <h3 class="font-semibold">Termination Date</h3>
          <p>{{ employee.terminationDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>