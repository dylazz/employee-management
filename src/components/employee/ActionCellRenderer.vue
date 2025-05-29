<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {Employee} from "../../types/employee.ts";

interface Props {
  params: ICellRendererParams &{
    data: Employee;
    onViewEmployee: (employee: Employee) => void;
  }
}

const props = defineProps<Props>();

const emit = defineEmits(['deleteEmployee']);

const onViewClick = () => {
  props.params.onViewEmployee(props.params.data);
};

const onEditClick = () => {
  // Add edit logic here
};

const onDeleteClick = () => {
  emit('deleteEmployee', props.params.data);
};
</script>

<template>
  <div class="flex flex-wrap gap-1 p-1">
    <button @click="onViewClick" class="px-2 py-1 bg-blue-500 text-white rounded">View</button>
    <button @click="onEditClick" class="px-2 py-1 bg-green-500 text-white rounded">Edit</button>
    <button @click="onDeleteClick" class="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
  </div>
</template>
