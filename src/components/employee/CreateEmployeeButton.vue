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
      class="fixed bottom-12 right-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-1 group"
  >
    <span class="text-base md:text-lg">+</span>
    <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[200px] transition-all duration-300 ease-in-out text-sm">Create Employee</span>
  </button>
</template>
