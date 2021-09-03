import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotToastModule } from '@ngneat/hot-toast';
import { NavComponent } from './component/nav/nav.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ProductListComponent } from './component/product-list/product-list.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmAccountComponent } from './component/confirm-account/confirm-account.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ProductInfoComponent } from './component/product-info/product-info.component';
import { CartComponent } from './component/cart/cart.component';
import { ScrollComponent } from './component/scroll/scroll.component';
import { CartInfoComponent } from './component/cart-info/cart-info.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { ProductCategoryComponent } from './component/product-category/product-category.component';
import { ProfileComponent } from './component/profile/profile.component';
import { TestComponent } from './component/test/test.component';
import { ErrorComponent } from './component/error/error.component';
import { ChatBoxComponent } from './component/chat-box/chat-box.component';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ProductListComponent,
    ConfirmAccountComponent,
    ResetPasswordComponent,
    ProductInfoComponent,
    CartComponent,
    ScrollComponent,
    CartInfoComponent,
    CheckoutComponent,
    ProductCategoryComponent,
    ProfileComponent,
    TestComponent,
    ErrorComponent,
    ChatBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    HotToastModule.forRoot(),
    CollapseModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
