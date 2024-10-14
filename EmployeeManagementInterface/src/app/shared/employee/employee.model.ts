import { Department } from "../department/department.model";
import { Designation } from "../designation/designation.model";
import { ProjectEmployee } from "../project-employee/project-employee.model";

export class Employee {
    id:number;
    firstName: string; 
    lastName:string;
    email: string;
    salary: number;
    hireDate:string;
    gender:string;
    isMarried: number;
    designation: Designation;
    department: Department;
    tblEmployeeTblProjects: ProjectEmployee[]
    image: string; 
}

export class AddNewEmployeeDTO{
    firstName: string; 
    lastName:string;
    email: string;
    salary: number;
    hireDate: string;
    gender:string;
    isMarried: number;
    designationId: number;
    departmentId: number;
    image: File | null;
}