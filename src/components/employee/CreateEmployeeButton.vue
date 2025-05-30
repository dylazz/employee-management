<script setup lang="ts">
import type {Employee} from "../../types/employee.ts";
import {generateNextId} from "../../utils/idGenerator.ts";

const emit = defineEmits<{
  (e: 'create', employee: Employee): void
}>();

const createEmptyEmployee = (): Employee =>({
  id: generateNextId(),
  fullName: '',
  occupation:'',
  department:'',
  dateOfEmployment: new Date().toISOString().split('T')[0],
  terminationDate: null
});

const handleCreateClick = () => {
  emit('create', createEmptyEmployee());
}

</script>

<template>
  <button
      @click="handleCreateClick"
      class="fixed bottom-6 right-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-1"
  >
    <span class="text-xs">+</span>
    <span class="text-sm">Create Employee</span>
  </button>

</template>
