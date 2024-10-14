import {ProjectEmployee } from "../project-employee/project-employee.model";

export class Project{
    id: number;
    projectName: string;
    startDate: string;
    endDate: string;
    image: string;
    listTech : string[];
    description: string
    tblEmployeeTblProjects : ProjectEmployee[]
}

export class AddNewProjectDTO {
    projectName: string;
    startDate: string;
    endDate: string;
    image: File | null;
    listTech : string[];
    description: string
}

export enum TechType {
    Angular,
    DotNet,
    NodeJS,
    ReactJS,
    JavaSP,
    NestJS,
    AndroidNative,
    ReactNative,
    Flutter
}