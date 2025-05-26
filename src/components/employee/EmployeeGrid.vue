<script setup lang="ts">
import {AgGridVue} from "ag-grid-vue3";
import {ref} from "vue"; // Vue Data Grid Component
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import employeeData from '../../assets/employees.json';

ModuleRegistry.registerModules([AllCommunityModule]);

// Loading Row data from JSON
const rowData = ref(employeeData);

// Column Definitions: Defines the columns to be displayed.
const colDefs = ref([
  { field: 'fullName', headerName: 'Employee Full Name', sortable: true, filter: true},
  { field: 'occupation', headerName: 'Occupation', sortable: true, filter: true},
  { field: 'department', headerName: 'Department', sortable: true, filter: true},
  {
    field: 'dateOfEmployment',
    headerName: 'Date of Employment',
    sortable: true,
    filter: true,
    cellRenderer: (params:{ value: string}) => employmentStatus(params.value)
  },
  {
    field: 'terminationDate',
    headerName: 'Termination Date',
    sortable: true,
    filter: true,
    cellRenderer: (params:{ value: string}) => terminationStatus(params.value)
  },
]);

// Receives param value of dateOfEmployment in string, converts to Date, and applies logic
function employmentStatus(value: string) {
  const today = new Date();
  const date = new Date(value);
  if (date > today) return '<span class="text-yellow-600">Employed Soon</span>';
  return '<span class="text-green-600">Currently Employed</span>';
}

// Receives param value of terminationDate in string, converts to Date, and applies logic
function terminationStatus(value: string) {
  if(!value) return '<span class="text-gray-400">None</span>';
  const today = new Date();
  const date = new Date(value);
  if (date > today) return '<span class="text-yellow-600">To Be Terminated</span>';
  return '<span class="text-red-600">Terminated</span>';
}

</script>

<template>
  <!-- The AG Grid component -->
  <ag-grid-vue
      :rowData="rowData"
      :columnDefs="colDefs"
      style="height: 500px"
  >
  </ag-grid-vue>
</template>

<style scoped>

</style>