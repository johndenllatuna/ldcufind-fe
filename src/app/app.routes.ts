import { Routes } from '@angular/router';
import { Login } from './admin/admin-login/admin-login.component';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard.component'; 
import { ItemManagement } from './admin/item-management/item-management.component';

export const routes: Routes = [
  { path: '', component: Login }, 
  { path: 'dashboard', component: AdminDashboard }, // Add the dashboard route
  {path: 'item-management', component: ItemManagement} // Add the item management route
];