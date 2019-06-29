import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  constructor(public _router: Router,
    public service: AppService,
    private toastr: ToastrService, ) { }
  loginEmail: any;

  resetPassword: any;
  ngOnInit() {
  }

  cancel = () => {
    this._router.navigate(["/login"]);
  }
  submit(): any {
    console.log("reset ")
    if (
      this.loginEmail === "" ||
      this.loginEmail === undefined ||
      this.loginEmail === null
    ) {
      alert("Please enter your email");
    } else if (
      this.resetPassword === "" ||
      this.resetPassword === undefined ||
      this.resetPassword === null
    ) {
      alert("Please enter your password.");
    } else {
      let data = {
        email: this.loginEmail,
        password: this.resetPassword
      };



      this.service.resetPasswordFunction(data).subscribe(apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          // console.log(apiResponse);
          this.toastr.success("Logged in successfully!!");
          // Cookie.set("authToken", apiResponse.data.authToken);
          //Cookie.set("userId", apiResponse.data.userDetails.userId);
          // Cookie.set("receiverName", apiResponse.data.userDetails.firstName + " " + apiResponse.data.userDetails.lastName);
          // this.service.setUserInfoInLocalStorage(apiResponse.data);
          console.log("login");
          //this.router.navigate(["/home", apiResponse.data.userDetails.userId]);
          //navigatin to dashboard if successfull....
          this._router.navigate([["/login"]]);
        } else {
          console.log(apiResponse);
          this.toastr.error(apiResponse.message);
        }
      });
    }
  }
}
