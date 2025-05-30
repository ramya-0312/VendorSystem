import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'vendor-login', component: VendorLoginComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'vendor-register',component:VendorRegisterComponent},
  { path: 'user-register',component:UserRegisterComponent},
  { path: 'vendor-forgot-password',component:VendorForgotPasswordComponent},
  { path: 'user-forgot-password',component:UserForgotPasswordComponent},
  { path: 'vendor-reset-password',component:VendorResetPasswordComponent},
  { path: 'user-reset-password',component:UserResetPasswordComponent},
  { path: 'user-dashboard',component:UserDashboardComponent},
  { path: 'message',component:MessageComponent},
  { path: 'vendor-list',component:VendorListComponent},
  {path:'update-profile',component:UpdateProfileComponent},
    {path:'image',component:ImageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
