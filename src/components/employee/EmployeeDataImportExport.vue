<script setup lang="ts">

import {ref, onMounted, onUnmounted} from 'vue';
import { ElMessage } from 'element-plus';
import type { GridApi } from 'ag-grid-community';
import type { Employee } from '../../types/employee.ts';
import { generateNextId } from '../../utils/idGenerator.ts';

declare let XLSX: any;

// Accepting gridApi prop
const props = defineProps<{
  gridApi: GridApi<Employee> | null
}>();
// Defining the emit event for updating the employee data
const emit = defineEmits<{
  'update-data': [employees: Employee[]]
}>();

// Export is handled via AG Grid's built in functionality
const handleExport = () => {
  if (!props.gridApi) {
    ElMessage.error('Something went wrong, please contact your systems administrator');
    console.error('Grid API is not initialized');
    return;
  }
  try {
    props.gridApi.exportDataAsCsv({
      allColumns: true
    });
    ElMessage.success('Downloading CSV file');
  } catch (error) {
    ElMessage.error('Something went wrong!');
    console.error('Failed to export CSV:', error);
  }
}

// Import functions
// Converting the raw data into XLSX workbook
const convertDataToWorkbook = (dataRows: ArrayBuffer) => {
  /* convert data to binary string */
  const data = new Uint8Array(dataRows);
  const arr = [];

  for (let i = 0; i !== data.length; ++i) {
    arr[i] = String.fromCharCode(data[i]);
  }

  const bstr = arr.join("");

  return XLSX.read(bstr, {type: "binary"});
}

// Processing worksheet data into Employee objects
const populateGrid = (workbook: any) => {
  if (!props.gridApi) {
    ElMessage.error('Grid not initialized');
    return;
  }
  // Data expected to be in the first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // we expect the following columns to be present
  const columns: Record<string, string> = {
    A: 'fullName',
    B: 'occupation',
    C: 'department',
    D: 'dateOfEmployment',
    E: 'terminationDate'
  };

  const newRowData: Employee[] = [];

  // Starting at the 2nd row - the first row are the headers
  let rowIndex = 2;

  // Using Col A to check if the row has data and should be processed
  while (worksheet['A' + rowIndex]) {
    const row: any = {
      id: generateNextId() // Generate new ID for imported employees
    };
    // Getting all the column keys(letters), and for each:
    Object.keys(columns).forEach((column) => {
      const cell = worksheet[column + rowIndex]; //If rowIndex=2, this creates A2,B2,C2 etc..
      if (cell) {
        //<--Getting the field name | Getting actual value from Excel cell-->
        row[columns[column]] = cell.w;
      }
    });
    // After all the columns have been processed, pushing the complete row, and moving to the next
    newRowData.push(row as Employee);
    rowIndex++;
  }

  // Firing an emit to the parent
  emit('update-data', newRowData);
}

// Hidden file input for Excel import
const fileInput = ref<HTMLInputElement | null>(null);

// Create a hidden file input when component mounts
onMounted(() => {
  fileInput.value = document.createElement('input');
  fileInput.value.type = 'file';
  fileInput.value.accept = '.xlsx, .xls';
  fileInput.value.style.display = 'none';
  fileInput.value.addEventListener('change', handleFileSelect);
  document.body.appendChild(fileInput.value);
});

// Cleanup on component unmount
onUnmounted(() => {
  if (fileInput.value) {
    fileInput.value.removeEventListener('change', handleFileSelect);
    document.body.removeChild(fileInput.value);
  }
});

// Trigger file input click
const handleImport = () => {
  fileInput.value?.click();
};

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    ElMessage.error('No file selected');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = e.target?.result;
      if (data) {
        const workbook = convertDataToWorkbook(data as ArrayBuffer);
        populateGrid(workbook);
        ElMessage.success('File imported successfully');
      }
    } catch (error) {
      ElMessage.error('Error reading file');
      console.error('Error reading file:', error);
    }
  };

  reader.readAsArrayBuffer(file);

  // Reset file input
  if (target) target.value = '';
};

</script>

<template>
  <!-- Export/Import controls -->
  <div class="mb-2 flex justify-center px-4 pt-2 gap-10">
    <button
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded inline-flex items-center"
        @click="handleExport()"
    >
      <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
      </svg>
      Export to Excel
    </button>

    <button
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded inline-flex items-center"
        @click="handleImport()"
    >
      <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M13 10v6H7v-6H2l8-8 8 8h-5zM0 18h20v2H0v-2z"/>
      </svg>
      Import Excel
    </button>
  </div>
</template>

<style scoped>

</style>