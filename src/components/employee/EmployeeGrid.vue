<script setup lang="ts">
import {AgGridVue} from "ag-grid-vue3";
import {ref} from "vue";
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import {employees} from '../../utils/employeeData.ts';
import ActionCellRenderer from './ActionCellRenderer.vue'
import type {Employee} from "../../types/employee.ts";
import EmployeeProfileModal from "./EmployeeProfileModal.vue";

ModuleRegistry.registerModules([AllCommunityModule]);

// Loading Row data from JSON
const rowData = ref(employees);

// Modal state
const selectedEmployee = ref<Employee | null>(null);
const isModalOpen = ref(false);
const modalEditMode = ref(false);

// Method to open modal
const openViewEmployeeModal = (employee: Employee) => {
  selectedEmployee.value = employee;
  isModalOpen.value = true;
  modalEditMode.value = false;
};

// Method to close modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedEmployee.value = null;
};

// Column Definitions
const colDefs = ref([
  {field: 'fullName', headerName: 'Employee Full Name', sortable: true, filter: true},
  {field: 'occupation', headerName: 'Occupation', sortable: true, filter: true},
  {field: 'department', headerName: 'Department', sortable: true, filter: true},
  {
    field: 'dateOfEmployment',
    headerName: 'Date of Employment',
    sortable: true,
    filter: true,
    cellRenderer: (params: { value: string }) => employmentStatus(params.value)
  },
  {
    field: 'terminationDate',
    headerName: 'Termination Date',
    sortable: true,
    filter: true,
    cellRenderer: (params: { value: string }) => terminationStatus(params.value)
  },
  {
    headerName: 'Actions',
    minWidth: 200,
    sortable: false,
    cellRenderer: ActionCellRenderer,
    cellRendererParams:{
      onViewEmployee: openViewEmployeeModal
    }
  }
]);

const defaultColDef = ref({
  resizable: true,
  autoHeight: true,
  flex: 1,
  minWidth: 100,

});

// Receives param value of dateOfEmployment in string, converts to Date, and applies logic
function employmentStatus(value: string) {
  const today = new Date();
  const date = new Date(value);
  if (date > today) return '<span class="text-yellow-600">Employed Soon</span>';
  return '<span class="text-green-600">Currently Employed</span>';
}

// Receives param value of terminationDate in string, converts to Date, and applies logic
function terminationStatus(value: string) {
  if (!value) return '<span class="text-gray-400">None</span>';
  const today = new Date();
  const date = new Date(value);
  if (date > today) return '<span class="text-yellow-600">To Be Terminated</span>';
  return '<span class="text-red-600">Terminated</span>';
}

</script>

<template>
  <div class="w-full h-[500px]">
    <!-- The AG Grid component -->
    <ag-grid-vue
        :rowData="rowData"
        :columnDefs="colDefs"
        :defaultColDef="defaultColDef"
        :domLayout="'autoHeight'"
        :pagination="true"
        style="height: 500px"
    >
    </ag-grid-vue>

    <!-- Employee Profile Modal
    Only renders if employee is selected
    Passes employee data to modal
    Controls Modal visibility
    Listens to 'close' emit -> executes closeModal()
    -->
    <employee-profile-modal
        v-if="selectedEmployee && isModalOpen"
        :employee="selectedEmployee"
        :is-open="isModalOpen"
        @close="closeModal"
    />

  </div>
</template>

<style scoped>

</style>