export interface Employee {
    id: number;
    code?: string; //Only new employees are to have a code
    fullName: string;
    occupation: string;
    department: string;
    dateOfEmployment: string;
    terminationDate: string | null;
}
