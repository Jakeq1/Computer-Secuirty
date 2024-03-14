import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';


export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent},
];
