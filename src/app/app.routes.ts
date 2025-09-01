import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ViewShoesComponent } from './components/shoes/view-shoes/view-shoes.component';
import { ViewShoeDetailsComponent } from './components/shoes/view-shoe-details/view-shoe-details.component';
import { ShoeAddUpdateFormComponent } from './components/shoes/shoe-add-update-form/shoe-add-update-form.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrdersComponent } from './components/orders/orders.component';

export const routes: Routes = [
    {path : '', component : LoginComponent},
    {path :'signup',component : SignupComponent},
    {path : 'login',component : LoginComponent},
    {path : 'shoelist',component : ViewShoesComponent},
    {path: 'shoe-details/:id',component : ViewShoeDetailsComponent},
    {path: 'shoe/add',component : ShoeAddUpdateFormComponent},
    {path : 'shoe/update/:id',component : ShoeAddUpdateFormComponent},
    {path: 'checkout',component : CheckoutComponent},
    {path : 'orders',component : OrdersComponent}
];
