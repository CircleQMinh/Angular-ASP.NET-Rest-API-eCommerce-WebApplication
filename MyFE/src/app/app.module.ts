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
import { AdminComponent } from './component/admin/admin.component';
import { ShipperComponent } from './component/shipper/shipper.component';
import { ThankyouComponent } from './component/thankyou/thankyou.component';
import { ProfileOrderComponent } from './component/profile-order/profile-order.component';
import { ProfileOrderInfoComponent } from './component/profile-order-info/profile-order-info.component';
import { ProfileFavoriteComponent } from './component/profile-favorite/profile-favorite.component';
import { SearchComponent } from './component/search/search.component';
import { NewsComponent } from './component/news/news.component';
import { ContactComponent } from './component/contact/contact.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NhanvienComponent } from './component/nhanvien/nhanvien.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { PromoInfoComponent } from './component/promo-info/promo-info.component';
import { PdfExportComponent } from './component/pdf-export/pdf-export.component';
import { ReadMoreComponent } from './component/read-more/read-more.component';
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
    ChatBoxComponent,
    AdminComponent,
    ShipperComponent,
    ThankyouComponent,
    ProfileOrderComponent,
    ProfileOrderInfoComponent,
    ProfileFavoriteComponent,
    SearchComponent,
    NewsComponent,
    ContactComponent,
    NhanvienComponent,
    PromoInfoComponent,
    PdfExportComponent,
    ReadMoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    HotToastModule.forRoot(),
    CollapseModule.forRoot(),
    NgxChartsModule,
    NgxImageZoomModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
