<script setup lang="ts">
import {ref} from 'vue';
import {
  AllCommunityModule,
  ModuleRegistry
} from 'ag-grid-community';
import {employees} from '../../utils/employeeData.ts';
import type {Employee} from "../../types/employee.ts";
import EmployeeFormModal, {type ModalMode} from './EmployeeFormModal.vue';
import CreateEmployeeButton from "./CreateEmployeeButton.vue";
import {ElMessage} from 'element-plus';
import EmployeeDataImportExport from './EmployeeDataImportExport.vue';
import EmployeeGrid from "./grid/EmployeeGrid.vue";

ModuleRegistry.registerModules([AllCommunityModule]);

// Loading Row data from JSON
const rowData = ref(employees);

const employeeGrid = ref<InstanceType<typeof EmployeeGrid> | null>(null);

// Modal state
const isModalOpen = ref(false);
const selectedEmployee = ref<Employee | null>(null);
const modalMode = ref<ModalMode>('view');

// Modal methods
const openModal = (employee: Employee, mode: ModalMode = 'view') => {
  selectedEmployee.value = employee;
  modalMode.value = mode;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedEmployee.value = null;
};

// Deletes the employee from the employee array (Mimics a delete function)
const handleEmployeeDelete = (employee: Employee) => {
  if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
    rowData.value = rowData.value.filter(emp => emp.id !== employee.id);
    ElMessage.warning('Employee deleted successfully');
  }
};

// Finding the index of employee to update. If found, update employee data. Checking if data changed before success message.
const handleEmployeeFormSubmit = (updatedEmployee: Employee) => {
  const index = rowData.value.findIndex(emp => emp.id === updatedEmployee.id);
  if (index !== -1) {
    if (JSON.stringify(rowData.value[index]) !== JSON.stringify(updatedEmployee)) {
      rowData.value[index] = updatedEmployee
      ElMessage.success('Employee updated successfully');
    }
  } else {
    // Adding new employee
    rowData.value.push(updatedEmployee);
    ElMessage.success(`Employee: ${updatedEmployee.fullName} created successfully`);
  }
  closeModal();
};

const handleEmployeeCreate = (newEmployee: Employee) => {
  openModal(newEmployee, 'create');
};

const updateGridData = (newData: Employee[]) => {
  rowData.value = newData;
};

</script>

<template>
  <div class="w-full h-[500px]">
    <!--Import/Export component-->
    <employee-data-import-export
        @update-data="updateGridData"
        :grid-api="employeeGrid?.gridApi ?? null"
    />

    <employee-grid
        ref="employeeGrid"
        :row-data="rowData"
        @view="(employee) => openModal(employee, 'view')"
        @edit="(employee) => openModal(employee, 'edit')"
        @delete="handleEmployeeDelete"
    />

    <!-- Employee Profile Modal
    Only renders if employee is selected
    Passing employee data & modal mode to child
    Receiving close & save from child
    -->
    <employee-form-modal
        v-if="isModalOpen && selectedEmployee"
        :employee="selectedEmployee"
        :mode="modalMode"
        @close="closeModal"
        @save="handleEmployeeFormSubmit"
    />

    <create-employee-button @create="handleEmployeeCreate"/>

  </div>
</template>