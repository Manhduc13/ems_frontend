import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { EmployeeListComponent } from './modules/employee/employee-list/employee-list.component';
import { HomeComponent } from './modules/common/home/home.component';
import { AboutComponent } from './modules/common/about/about.component';
import { ServiceComponent } from './modules/common/service/service.component';
import { ContactComponent } from './modules/common/contact/contact.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { ProfileComponent } from './modules/employee/profile/profile.component';
import { ProjectListComponent } from './modules/project/project-list/project-list.component';

export const routes: Routes = [
    {path: '', component: AboutComponent},
    {path: 'about', component: AboutComponent},
    {path: 'services', component: ServiceComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'login', component: LoginComponent},
    {path: 'employees', component: EmployeeListComponent},
    {path: 'employees/profile', component: ProfileComponent},
    {path: 'forgot-password/:email/:token', component: ForgotPasswordComponent},
    {path: 'projects', component: ProjectListComponent},
];
