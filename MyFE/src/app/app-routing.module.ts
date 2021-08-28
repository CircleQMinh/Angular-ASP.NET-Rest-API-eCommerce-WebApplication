import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartInfoComponent } from './component/cart-info/cart-info.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { ConfirmAccountComponent } from './component/confirm-account/confirm-account.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { ProductCategoryComponent } from './component/product-category/product-category.component';
import { ProductInfoComponent } from './component/product-info/product-info.component';
import { RegisterComponent } from './component/register/register.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';

const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirmAccount', component: ConfirmAccountComponent },
  { path: 'confirmResetPassword', component: ConfirmAccountComponent },
  { path: 'password-recover', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'product/:id', component: ProductInfoComponent },
  { path: 'cart', component: CartInfoComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'products', component: ProductCategoryComponent },
  { path: 'fruit', component: ProductCategoryComponent },
  { path: 'vegetable', component: ProductCategoryComponent },
  { path: 'confectionery', component: ProductCategoryComponent },
  { path: 'snack', component: ProductCategoryComponent },
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
