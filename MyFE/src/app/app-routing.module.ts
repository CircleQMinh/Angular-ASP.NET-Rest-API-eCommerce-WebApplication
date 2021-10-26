import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './component/admin/admin.component';

import { CartInfoComponent } from './component/cart-info/cart-info.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { ConfirmAccountComponent } from './component/confirm-account/confirm-account.component';
import { ContactComponent } from './component/contact/contact.component';
import { ErrorComponent } from './component/error/error.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { NewsComponent } from './component/news/news.component';
import { NhanvienComponent } from './component/nhanvien/nhanvien.component';
import { PdfExportComponent } from './component/pdf-export/pdf-export.component';
import { ProductCategoryComponent } from './component/product-category/product-category.component';
import { ProductInfoComponent } from './component/product-info/product-info.component';
import { ProfileFavoriteComponent } from './component/profile-favorite/profile-favorite.component';
import { ProfileOrderInfoComponent } from './component/profile-order-info/profile-order-info.component';
import { ProfileOrderComponent } from './component/profile-order/profile-order.component';
import { ProfileComponent } from './component/profile/profile.component';
import { PromoInfoComponent } from './component/promo-info/promo-info.component';
import { RegisterComponent } from './component/register/register.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { SearchComponent } from './component/search/search.component';
import { ShipperComponent } from './component/shipper/shipper.component';
import { TestComponent } from './component/test/test.component';
import { ThankyouComponent } from './component/thankyou/thankyou.component';

const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'test', component: TestComponent },
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
  { path: 'animalproduct', component: ProductCategoryComponent },
  { path: 'cannedfood', component: ProductCategoryComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'profile/:id/favorite', component: ProfileFavoriteComponent },
  { path: 'profile/:id/order', component: ProfileOrderComponent },
  { path: 'profile/:id/order/:oid', component: ProfileOrderInfoComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'shipper', component: ShipperComponent },
  { path: 'thankyou', component: ThankyouComponent },
  { path: 'search', component: SearchComponent },
  { path: 'news', component: NewsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'quanly', component: NhanvienComponent },
  { path: 'xuatpdf', component: PdfExportComponent },
  { path: 'khuyenmai/:id', component: PromoInfoComponent },
  { path: 'error', component: ErrorComponent },
  {path: '**', redirectTo: '/error', pathMatch: 'full'}
];


@NgModule({
  imports: [  RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
