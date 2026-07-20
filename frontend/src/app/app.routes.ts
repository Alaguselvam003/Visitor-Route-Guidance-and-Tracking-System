import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { GateKioskComponent } from './components/gate-kiosk/gate-kiosk.component';
import { ReceptionComponent } from './components/reception/reception.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RouteGuidanceComponent } from './components/route-guidance/route-guidance.component';
import { authGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { HostComponent } from './components/host/host.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'gate', 
    component: GateKioskComponent, 
    canActivate: [authGuard], 
    data: { roles: ['SECURITY', 'ADMIN', 'VISITOR'] } 
  },
  { 
    path: 'reception', 
    component: ReceptionComponent, 
    canActivate: [authGuard], 
    data: { roles: ['RECEPTIONIST', 'ADMIN'] } 
  },
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard], 
    data: { roles: ['ADMIN'] } 
  },
  { 
    path: 'route-guidance', 
    component: RouteGuidanceComponent, 
    canActivate: [authGuard], 
    data: { roles: ['VISITOR'] } 
  },
  { 
    path: 'host', 
    component: HostComponent, 
    canActivate: [authGuard], 
    data: { roles: ['HOST'] } 
  },
  { path: 'access-denied', component: AccessDeniedComponent }
];
