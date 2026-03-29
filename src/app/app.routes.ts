import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
import { CronjobsComponent } from './pages/cronjobs/cronjobs.component';
import { DashboardContentComponent } from './pages/dashboard-content/dashboard-content.component';
import { ExecutionLogsComponent } from './pages/execution-logs/execution-logs.component';
import { AddEditCronjobComponent } from './pages/add-edit-cronjob/add-edit-cronjob.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { 
    path: 'home', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardContentComponent },
      { path: 'cronjobs', component: CronjobsComponent },
      { path: 'execution-logs', component: ExecutionLogsComponent },
      { path: 'cronjobs/create', component: AddEditCronjobComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
