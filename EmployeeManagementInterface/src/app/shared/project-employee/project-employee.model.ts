import { Employee } from "../employee/employee.model";
import { Project } from "../project/project.model";

export class ProjectEmployee{
    id: number;
    tblEmployeeId: number;
    tblProjectId: number;
    tblEmployee: Employee;
    tblProject: Project;
    role: string;
    assignmentDate: string
}

export class AddEmpToProjectDTO
{
    empId: number;
    role: string;
    assignmentDate: string
}