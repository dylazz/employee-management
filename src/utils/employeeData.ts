import employeeData from '../assets/employees.json';
import {generateNextId} from './idGenerator.ts';

// Generating IDs to the existing employee data set
export const employees = employeeData.map(employee =>
    ({
        id: generateNextId(),
        ...employee
    }));