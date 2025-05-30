<script setup lang="ts">
import {AgGridVue} from 'ag-grid-vue3';
import {ref} from 'vue';
import {AllCommunityModule, type FirstDataRenderedEvent, type GridSizeChangedEvent, ModuleRegistry} from 'ag-grid-community';
import {employees} from '../../utils/employeeData.ts';
import ActionCellRenderer from './ActionCellRenderer.vue'
import type {Employee} from "../../types/employee.ts";
import EmployeeProfileModal, {type ModalMode} from './EmployeeProfileModal.vue';
import CreateEmployeeButton from "./CreateEmployeeButton.vue";
import {ElMessage} from 'element-plus';

ModuleRegistry.registerModules([AllCommunityModule]);

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

/*  Deletes the employee from the employee array (Mimics a delete function)
    Can implement localstorage solution to retain delete on refresh - not required?
* */
const handleEmployeeDelete = (employee: Employee) => {
  if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
    rowData.value = rowData.value.filter(emp => emp.id !== employee.id);
    ElMessage.warning('Employee deleted successfully');
  }
};

// Finding the index of employee to update. If found, update employee data. Checking if data changed before success message.
const handleEmployeeSave = (updatedEmployee: Employee) => {
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

// Loading Row data from JSON
const rowData = ref(employees);

const defaultColDef = ref({
  resizable: true,
  autoHeight: true,
  flex: 1,
  minWidth: 100,
  suppressSizeToFit: false
});

// Column Definitions
const colDefs = ref([
  {
    field: 'fullName',
    headerName: 'Employee Full Name',
    sortable: true,
    filter: true,
    minWidth: 130,
    suppressSizeToFit: false,
  },
  {
    field: 'occupation',
    headerName: 'Occupation',
    sortable: true,
    filter: true,
    minWidth: 100
  },
  {
    field: 'department',
    headerName: 'Department',
    sortable: true,
    filter: true,
    minWidth: 120
  },
  {
    field: 'dateOfEmployment',
    headerName: 'Date of Employment',
    sortable: true,
    filter: true,
    minWidth: 150,
    cellRenderer: (params: { value: string }) => employmentStatus(params.value)
  },
  {
    field: 'terminationDate',
    headerName: 'Termination Date',
    sortable: true,
    filter: true,
    minWidth: 110,
    cellRenderer: (params: { value: string }) => terminationStatus(params.value)
  },
  {
    field: 'actions',
    headerName: 'Actions',
    minWidth: 190,
    sortable: false,
    cellRenderer: ActionCellRenderer,
    cellRendererParams: {
      onViewClick: (employee: Employee) => openModal(employee, 'view'),
      onEditClick: (employee: Employee) => openModal(employee, 'edit'),
      onDeleteClick: handleEmployeeDelete
    },
    suppressSizeToFit: false, // Always show this column
  }
]);

const onGridSizeChanged = (params: GridSizeChangedEvent) => {
  // Getting the current width of the grid's viewport
  const gridWidth = document.querySelector('.ag-body-viewport')?.clientWidth || 0;

  // Disable resizing on mobile
  defaultColDef.value = {
    ...defaultColDef.value,
    resizable: gridWidth > 768
  };
  // Initialising arrays to track columns to be shown or hiddden
  const columnsToShow = [];
  const columnsToHide = [];

  // Tracking total width of visible columns
  let totalColsWidth = 0;
  // Getting all grid columns using AG Grid's API
  const allColumns = params.api.getColumns();

  if (allColumns) {
    // Finding the mandatory columns
    const mandatoryColumns = allColumns.filter(col =>
        ['fullName', 'actions'].includes(col.getColId())
    );
    // Calculating width needed for mandatory columns
    totalColsWidth = mandatoryColumns.reduce((sum, col) => sum + col.getMinWidth(), 0);
    // Adding mandatory columns to the Show array
    columnsToShow.push(...mandatoryColumns.map(col => col.getColId()));

    // Filtering out the mandatory columns
    const otherColumns = allColumns.filter(col =>
        !['fullName', 'actions'].includes(col.getColId())
    );
    // Processing each optional column
    for (const column of otherColumns) {
      // Checking if column would exceed available width
      if (totalColsWidth + column.getMinWidth() <= gridWidth) {
        // If it fits, add to Show array, and update the total width of the columns
        columnsToShow.push(column.getColId());
        totalColsWidth += column.getMinWidth();
      } else {
        columnsToHide.push(column.getColId());
      }
    }
  }
  // Calling the AG Grid API to show/hide the columns
  params.api.setColumnsVisible(columnsToShow, true);
  params.api.setColumnsVisible(columnsToHide, false);

};

const onFirstDataRendered = (params: FirstDataRenderedEvent) => {
  params.api.autoSizeAllColumns();
  params.api.sizeColumnsToFit();
};

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
        @grid-size-changed="onGridSizeChanged"
        @first-data-rendered="onFirstDataRendered"
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
        v-if="isModalOpen && selectedEmployee"
        :employee="selectedEmployee"
        :mode="modalMode"
        @close="closeModal"
        @save="handleEmployeeSave"
    />

    <create-employee-button @create="handleEmployeeCreate"/>

  </div>
</template>

<style scoped>

</style>