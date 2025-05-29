<script setup lang="ts">
import type {Employee} from "../../types/employee";
import {computed, ref, watchEffect} from "vue";

export type ModalMode = 'view' | 'edit';

const props = defineProps<{
  employee: Employee;
  mode: ModalMode;
}>();

const formatDate = (date: string | null | undefined) => {
  if (!date) return 'Not Set';
  return new Date(date).toLocaleDateString();
}

const emit = defineEmits(['close', 'save']);

// Creating a reactive copy of employee data
const formData = ref<Employee>({...props.employee});

const isEditing = computed(() => props.mode === 'edit');

const handleClose = () => {
  emit('close');
}

const handleSaveClick = () => {
  emit('save', formData.value);
  emit('close');
};

</script>

<template>
  <div @click.self="handleClose" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Reactive Header with close button -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">
          {{ isEditing ? 'Edit Employee' : 'Employee Profile' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- Employee details -->
      <div class="space-y-4">
        <div>
          <h3 class="font-semibold">Full Name</h3>
          <input
              v-if="isEditing"
              v-model="formData.fullName"
              type="text"
              class="w-full p-2 border rounded-md"
          >
          <p v-else>{{ employee.fullName }}</p>
        </div>

        <div>
          <h3 class="font-semibold">Occupation</h3>
          <input
              v-if="isEditing"
              v-model="formData.occupation"
              type="text"
              class="w-full p-2 border rounded-md"
          >
          <p v-else>{{ employee.occupation }}</p>
        </div>

        <div>
          <h3 class="font-semibold">Department</h3>
          <input
              v-if="isEditing"
              v-model="formData.department"
              type="text"
              class="w-full p-2 border rounded-md"
          >
          <p v-else>{{ employee.department }}</p>
        </div>

        <div>
          <h3 class="font-semibold">Date of Employment</h3>
          <input
              v-if="isEditing"
              v-model="formData.dateOfEmployment"
              type="date"
              class="w-full p-2 border rounded-md"
          >
          <p v-else>{{ formatDate(employee.dateOfEmployment) }}</p>
        </div>

        <div>
          <h3 class="font-semibold">Termination Date</h3>
          <input
              v-if="isEditing"
              v-model="formData.terminationDate"
              type="date"
              class="w-full p-2 border rounded-md"
          >
          <p v-else>{{ formatDate(employee.terminationDate) }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2 mt-4">
          <button
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {{ isEditing ? 'Cancel' : '' }}
          </button>
          <button
              v-if="isEditing"
              @click="handleSaveClick"
              class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-green-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>