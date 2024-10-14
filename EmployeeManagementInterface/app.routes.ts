import { Routes } from '@angular/router';
import { EmployeeComponent } from './src/app/employee/employee.component';
import { ProjectComponent } from './src/app/project/project.component';
import { DepartmentComponent } from './src/app/department/department.component';
import { EmployeeViewComponent } from './src/app/employee/employee-view/employee-view.component';
import { ProjectDetailComponent } from './src/app/project/project-detail/project-detail.component';
import { AuthGuard } from './src/app/shared/auth/auth-guard.service';
import { HomepageComponent } from './src/app/homepage/homepage.component';
import { Login } from './src/app/shared/auth/auth.module';
import { LoginComponent } from './src/app/auth/login/login.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'homepage/employee', 
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'homepage',
        component: HomepageComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'employee', component: EmployeeComponent },
            { path: 'project', component: ProjectComponent },
            { path: 'department', component: DepartmentComponent },
            { path: 'employee/:id', component: EmployeeViewComponent, },
            { path: 'project/:id', component: ProjectDetailComponent,},
        ]
    },
    // {
    //     path: 'employee',
    //     component: EmployeeComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'homepage/project',
    //     component: ProjectComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'homepage/department',
    //     component: DepartmentComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'homepage/employee/:id',
    //     component: EmployeeViewComponent,
    //     canActivate: [AuthGuard]
    // },
    // {
    //     path: 'homepage/project/:id',
    //     component: ProjectDetailComponent,
    //     canActivate: [AuthGuard]
    // },
    {
        path: '**',
        redirectTo: 'homepage/employee'
    }
];
