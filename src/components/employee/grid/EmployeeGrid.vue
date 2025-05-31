<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3';
import { ref, shallowRef } from 'vue';
import {
  AllCommunityModule,
  type FirstDataRenderedEvent,
  type GridReadyEvent,
  type GridSizeChangedEvent,
  ModuleRegistry,
  type GridApi
} from 'ag-grid-community';
import type { Employee } from "../../../types/employee.ts";
import ActionCellRenderer from './ActionCellRenderer.vue';

ModuleRegistry.registerModules([AllCommunityModule]);
// Getting row data via props from parent
defineProps<{
  rowData: Employee[]
}>();

const emit = defineEmits<{
  'update:rowData': [Employee[]], // Two-way update emit event
  'view': [Employee],
  'edit': [Employee],
  'delete': [Employee]
}>();

const gridApi = shallowRef<GridApi<Employee> | null>(null);

defineExpose({
  gridApi
});

const defaultColDef = ref({
  resizable: true,
  autoHeight: true,
  flex: 1,
  minWidth: 100,
  suppressSizeToFit: false,
  sortable: true,
  filter: true
});

// Column Definitions
const colDefs = ref([
  {
    field: 'fullName',
    headerName: 'Employee Full Name',
    minWidth: 130,
    suppressSizeToFit: false,
  },
  {
    field: 'occupation',
    headerName: 'Occupation',
    minWidth: 100
  },
  {
    field: 'department',
    headerName: 'Department',
    minWidth: 120
  },
  {
    field: 'dateOfEmployment',
    headerName: 'Date of Employment',
    minWidth: 150,
    cellRenderer: (params: { value: string }) => employmentStatus(params.value)
  },
  {
    field: 'terminationDate',
    headerName: 'Termination Date',
    minWidth: 110,
    cellRenderer: (params: { value: string }) => terminationStatus(params.value)
  },
  {
    field: 'actions',
    headerName: 'Actions',
    minWidth: 190,
    sortable: false,
    filter: false,
    cellRenderer: ActionCellRenderer,
    cellRendererParams: {
      onViewClick: (employee: Employee) => emit('view', employee),
      onEditClick: (employee: Employee) => emit('edit', employee),
      onDeleteClick: (employee: Employee) => emit('delete', employee),
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
const employmentStatus = (value: string) => {
  const today = new Date();
  const date = new Date(value);
  if (date > today) return '<span class="text-yellow-600">Employed Soon</span>';
  return '<span class="text-green-600">Currently Employed</span>';
};

// Receives param value of terminationDate in string, converts to Date, and applies logic
const terminationStatus = (value: string) => {
  if (!value) return '<span class="text-gray-400">None</span>';
  const today = new Date();
  const date = new Date(value);
  if (date > today) return '<span class="text-yellow-600">To Be Terminated</span>';
  return '<span class="text-red-600">Terminated</span>';
};
const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api;
};
</script>

<template>
  <!-- The AG Grid component -->
  <ag-grid-vue
      :rowData="rowData"
      :columnDefs="colDefs"
      :defaultColDef="defaultColDef"
      :domLayout="'autoHeight'"
      :pagination="true"
      @grid-size-changed="onGridSizeChanged"
      @first-data-rendered="onFirstDataRendered"
      @grid-ready="onGridReady"
      style="height:auto"
  >
  </ag-grid-vue>
</template>
