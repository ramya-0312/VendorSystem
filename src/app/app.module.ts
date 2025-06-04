import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { VendorRegisterComponent } from './vendor-register/vendor-register.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { VendorForgotPasswordComponent } from './vendor-forgot-password/vendor-forgot-password.component';
import { UserForgotPasswordComponent } from './user-forgot-password/user-forgot-password.component';
import { VendorResetPasswordComponent } from './vendor-reset-password/vendor-reset-password.component';
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MessageComponent } from './message/message.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ImageComponent } from './imageconverter/image/image.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    VendorLoginComponent,
    UserLoginComponent,
    VendorRegisterComponent,
    UserRegisterComponent,
    VendorForgotPasswordComponent,
    UserForgotPasswordComponent,
    VendorResetPasswordComponent,
    UserResetPasswordComponent,
    UserDashboardComponent,
    MessageComponent,
    VendorListComponent,
    UpdateProfileComponent,
    ImageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, // ✅ REQUIRED
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      tapToDismiss: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
