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
      class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
  >
    <span class="text-lg">+</span>
    Create Employee
  </button>
</template>
