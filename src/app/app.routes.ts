import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ViewShoesComponent } from './components/shoes/view-shoes/view-shoes.component';
import { ViewShoeDetailsComponent } from './components/shoes/view-shoe-details/view-shoe-details.component';
import { ShoeAddUpdateFormComponent } from './components/shoes/shoe-add-update-form/shoe-add-update-form.component';

import { CartComponent } from './components/cart/cart.component';
import { authGuard } from './core/guards/auth.guard';
import { OrdersComponent } from './components/orders/all-orders/orders.component';
import { OrderDetailsComponent } from './components/orders/order-details/order-details.component';
import { ViewCategoriesComponent } from './components/category/view-categories/view-categories.component';

export const routes: Routes = [
    {path : '', component : ViewShoesComponent,canActivate :[authGuard]},
    {path :'signup',component : SignupComponent},
    {path : 'login',component : LoginComponent},
    {path : 'shoelist',component : ViewShoesComponent,canActivate :[authGuard]},
    {path: 'shoe-details/:id',component : ViewShoeDetailsComponent,canActivate :[authGuard]},
    {path: 'shoe/add',component : ShoeAddUpdateFormComponent,canActivate :[authGuard]},
    {path : 'shoe/update/:id',component : ShoeAddUpdateFormComponent,canActivate :[authGuard]},
    {path: 'checkout',component : CartComponent,canActivate :[authGuard]},
    {path : 'orders',component : OrdersComponent,canActivate :[authGuard]},
    {path: 'orders/detail/:id',component : OrderDetailsComponent,canActivate :[authGuard]},
    {path : 'categories',component : ViewCategoriesComponent,canActivate :[authGuard]},
    {path:'**',component : LoginComponent}
];
