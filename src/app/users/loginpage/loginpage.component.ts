import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { ToastrService } from "ngx-toastr";
//import $ from "jquery";
import { AppService } from "../../app.service";



@Component({
  selector: "app-loginpage",
  templateUrl: "./loginpage.component.html",
  styleUrls: ["./loginpage.component.css"]
})
export class LoginpageComponent implements OnInit {
  loginEmail: any;

  loginPassword: any;

  constructor(
    public _router: Router,
    public service: AppService,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    /** spinner starts on init */
  }
  public goToSignUp: any = () => {
    this._router.navigate(["/signup"]);
  };

  public goToForgotpassword: any = () => {
    this._router.navigate(["/forgotpassword"]);
  };

  login(): any {
    if (
      this.loginEmail === "" ||
      this.loginEmail === undefined ||
      this.loginEmail === null
    ) {
      alert("Please enter your email");
    } else if (
      this.loginPassword === "" ||
      this.loginPassword === undefined ||
      this.loginPassword === null
    ) {
      alert("Please enter your password.");
    } else {
      let data = {
        email: this.loginEmail,
        password: this.loginPassword
      };

      this.service.loginFunction(data).subscribe(apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          // console.log(apiResponse);
          this.toastr.success("Logged in successfully!!");
          Cookie.set("authToken", apiResponse.data.authToken);
          Cookie.set("userId", apiResponse.data.userDetails.userId);
          Cookie.set("receiverName", apiResponse.data.userDetails.firstName + " " + apiResponse.data.userDetails.lastName);
          this.service.setUserInfoInLocalStorage(apiResponse.data);
          console.log("login");
          //this.router.navigate(["/home", apiResponse.data.userDetails.userId]);
          //navigatin to dashboard if successfull....
          this._router.navigate(["list"]);
        } else {
          console.log(apiResponse);
          this.toastr.error(apiResponse.message);
        }
      });
    }
  }
  /*
  forgotPassword(): any {
    this.service.sendMail(this.forgetPassEmail).subscribe(data => {
      console.log(data);
      if (data.status === 200) {
        window.document.getElementById("exampleModal1").click();
        this.forgetPassEmail = "";
        this.toastr.success(
          "Change password email has been sent to your registered mail id"
        );
      } else {
        this.toastr.error(data.message);
      }
    });
  }*/
}
