import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginpageComponent } from "./loginpage/loginpage.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
//import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { RouterModule, Router } from "@angular/router";
import { SignuppageComponent } from './signuppage/signuppage.component';
import { FriendsComponent } from './friends/friends.component';
import { LayoutModule } from '../layout/layout.module';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    LayoutModule,

    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot()
  ],
  declarations: [LoginpageComponent, SignuppageComponent, FriendsComponent, ForgetpasswordComponent, ResetpasswordComponent]
})
export class UsersModule { }
