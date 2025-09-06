import { Routes } from '@angular/router';
import { SignIn } from './components/pages/sign-in/sign-in';
import { SignUp } from './components/pages/sign-up/sign-up';

// Admin
import { Dashboard } from './components/pages/admin/dashboard/dashboard';
import { ProductComponent } from './components/pages/admin/products/products';
import { ServicesComponent } from './components/pages/admin/services/services';
import { Invoices } from './components/pages/admin/invoices/invoices';
import { AppointmentComponent } from './components/pages/admin/appointment/appointment';

// User
import { UserDashboard } from './components/pages/user/dashboard/dashboard';
import { PerfilComponent } from './components/pages/user/profile/profile';
import { UserAppointments } from './components/pages/user/appointments/appointments';
import { UserInvoices } from './components/pages/user/invoices/invoices';
import { UserServices } from './components/pages/user/services/services';

// Guard
import { authGuard } from './guards/auth-guard';
import { CartComponent } from './components/pages/user/cart/cart';
import { HomeComponent } from './components/pages/home/home';
import { Services } from './components/pages/services/services';
import { Products } from './components/pages/products/products';
import { Payment } from './components/pages/payment/payment';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp },
  { path: 'user-services', component: Services },
  { path: 'user-products', component: Products },
  { path: 'payments', component: Payment },
  // Admin
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'products', component: ProductComponent, canActivate: [authGuard] },
  { path: 'services', component: ServicesComponent, canActivate: [authGuard] },
  { path: 'invoices', component: Invoices, canActivate: [authGuard] },
  {
    path: 'appointment',
    component: AppointmentComponent,
    canActivate: [authGuard],
  },

  // User
  {
    path: 'user/dashboard',
    component: UserDashboard,
    canActivate: [authGuard],
  },
  {
    path: 'user/profile',
    component: PerfilComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user/appointments',
    component: UserAppointments,
    canActivate: [authGuard],
  },
  { path: 'user/invoices', component: UserInvoices, canActivate: [authGuard] },
  { path: 'user/services', component: UserServices, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '/home' },
];
