<script setup lang="ts">
import type {Employee} from "../../types/employee";
import {computed, ref} from "vue";

export type ModalMode = 'view' | 'edit' | 'create';

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
const errors = ref<Record<string, string>>({});

// Responsive modal title
const modalTitle = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Create Employee';
    case 'edit':
      return 'Edit Employee';
    default:
      return 'Employee Profile';
  }
});

const modalSubmitText = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Create Employee';
    case 'edit':
      return 'Save Changes';
  }
});

const isEditing = computed(() => props.mode === 'edit' || props.mode === 'create');

const handleClose = () => {
  emit('close');
}

const handleSaveClick = (e: Event) => {
  e.preventDefault();

  if (validateForm()) {
    emit('save', formData.value);
    emit('close');
  }
};

const validateForm = () => {
  errors.value = {};

  if (!formData.value.fullName?.trim()) {
    errors.value.fullName = 'Full name is required';
  }

  if (!formData.value.occupation?.trim()) {
    errors.value.occupation = 'Occupation is required';
  }

  if (!formData.value.department?.trim()) {
    errors.value.department = 'Department is required';
  }

  if (props.mode === 'create' && !formData.value.code?.trim()) {
    errors.value.code = 'Employee code is required';
  }
  return Object.keys(errors.value).length === 0;
};

</script>

<template>
  <div @click.self="handleClose" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Reactive Header with close button -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">
          {{ modalTitle }}
        </h2>
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
      <form @submit.prevent="handleSaveClick" class="space-y-4">
        <!-- Employee details -->
        <div class="space-y-4">
          <!-- Employee Code in case of creating a new employee -->
          <div v-if="props.mode === 'create'">
            <h3 class="font-semibold">Code</h3>
            <input
                v-model="formData.code"
                type="text"
                class="w-full p-2 border rounded-md"
                :class="{ 'border-red-500': errors.code }"
            >
            <span v-if="errors.code" class="text-sm text-red-500">{{ errors.code }}</span>
          </div>
          <div>
            <h3 class="font-semibold">Full Name</h3>
            <template v-if="isEditing">
              <input
                  v-model="formData.fullName"
                  type="text"
                  class="w-full p-2 border rounded-md"
                  :class="{ 'border-red-500': errors.fullName }"
              >
              <span v-if="errors.fullName" class="text-sm text-red-500">{{ errors.fullName }}</span>
            </template>
            <p v-else>{{ employee.fullName }}</p>
          </div>

          <div>
            <h3 class="font-semibold">Occupation</h3>
            <template v-if="isEditing">
              <input
                  v-model="formData.occupation"
                  type="text"
                  class="w-full p-2 border rounded-md"
                  :class="{ 'border-red-500': errors.occupation }"
              >
              <span v-if="errors.occupation" class="text-sm text-red-500">{{ errors.occupation }}</span>
            </template>
            <p v-else>{{ employee.occupation }}</p>
          </div>

          <div>
            <h3 class="font-semibold">Department</h3>
            <template v-if="isEditing">
              <input
                  v-model="formData.department"
                  type="text"
                  class="w-full p-2 border rounded-md"
                  :class="{ 'border-red-500': errors.department }"
              >
              <span v-if="errors.department" class="text-sm text-red-500">{{ errors.department }}</span>
            </template>
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
                type="button"
                @click="handleClose"
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {{ isEditing ? 'Cancel' : '' }}
            </button>
            <button
                v-if="isEditing"
                type="submit"
                class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-green-500"
            >
              {{ modalSubmitText }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>