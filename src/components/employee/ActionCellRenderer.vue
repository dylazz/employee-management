<script setup lang="ts">
import type {ICellRendererParams} from 'ag-grid-community';
import type {Employee} from '../../types/employee.ts';

interface Props {
  params: ICellRendererParams &{
    data: Employee;
    onViewClick: (employee: Employee) => void;
    onEditClick: (employee: Employee) => void;
    onDeleteClick: (employee: Employee) => void;
  }
}

const props = defineProps<Props>();

const { data, onViewClick, onEditClick, onDeleteClick } = props.params;

</script>

<template>
  <div class="flex flex-wrap gap-1 p-1">
    <button @click="onViewClick(data)" class="px-2 py-1 bg-blue-500 text-white rounded">View</button>
    <button @click="onEditClick(data)" class="px-2 py-1 bg-green-500 text-white rounded">Edit</button>
    <button @click="onDeleteClick(data)" class="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
  </div>
</template>
