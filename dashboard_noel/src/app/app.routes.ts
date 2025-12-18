import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { HelloComponent } from './features/auth/pages/hello/hello.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/pages/dashboard.component';
import { IncidentListPageComponent } from './features/admin/incident/pages/incident-list-page.component';
import { UsersListPageComponent } from './features/admin/users/pages/users-list-page.component';
import { ProfileListComponent } from './features/admin/profiles/pages/profile-list.component';
import { TrafficOverviewComponent } from './features/admin/traffic/pages/traffic-overview.component';
import { ConfigurationComponent } from './features/admin/configuration/pages/configuration.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HelloComponent }
    ]
  },
  // Routes d'authentification
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  // Dashboard admin avec layout
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'incidents', component: IncidentListPageComponent },
      { path: 'users', component: UsersListPageComponent },
      { path: 'profiles', component: ProfileListComponent },
      { path: 'traffic', component: TrafficOverviewComponent },
      { path: 'configuration', component: ConfigurationComponent }, 
      { path: 'profile', component: ProfileListComponent },
      { path: 'settings', component: ProfileListComponent }
    ]
  },
  // Redirection par défaut
  { path: '**', redirectTo: '' }
];