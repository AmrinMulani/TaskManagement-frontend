import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  forgotPassEmail: string
  constructor(public _router: Router,
    public service: AppService,
    private toastr: ToastrService, ) { }

  ngOnInit() {
  }
  public goToSignIn: any = () => {
    this._router.navigate(["/login"]);
  };
  public goToSignUp: any = () => {
    this._router.navigate(["/signup"]);
  };
  submit = () => {
    if (!this.forgotPassEmail) {
      this.toastr.warning("Enter Registered Mail")
    } else {
      this.service.forgotPassword(this.forgotPassEmail).subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.info('An email with password reset link has been sent to you on your email');
            this._router.navigate(["/login"]);
            // this.cancelForgetPassword.emit(false);
          } else {
            this.toastr.error(apiResponse.message);
          }
        }, (error) => {
          this.toastr.error(error.message);
        })
    }
  }
  cancel = () => {
    this._router.navigate(["/login"]);
  }
}

