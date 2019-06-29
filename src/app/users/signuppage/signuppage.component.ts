import { Component, OnInit } from "@angular/core";
import { AppService } from "../../app.service";
import countryName from "../../../assets/countryName.json";
import countryCode1 from "../../../assets/countryCode.json";
import { ActivatedRoute, Router } from "@angular/router";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-signuppage",
  templateUrl: "./signuppage.component.html",
  styleUrls: ["./signuppage.component.css"]
})
export class SignuppageComponent implements OnInit {
  loginEmail: any;
  password: any;
  firstName: any;
  lastName: any;
  loginPassword: any;
  email: any;
  mobileNumber: any;
  countryCategory: String;
  countryName1 = countryName;
  countryCode = countryCode1;

  selectedCountryCode: any;
  forgetPassEmail: any;

  constructor(
    public router: Router,
    public service: AppService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    /** spinner starts on init */
  }
  public goToSignIn: any = () => {
    this.router.navigate(["/login"]);
  };
  onChange(e) {
    // console.log(e.target.value);
    console.log(this.countryCategory);
    for (let code in this.countryCode) {
      if (code == this.countryCategory) {
        this.selectedCountryCode = this.countryCode[code];
        console.log(this.selectedCountryCode);
      }
    }
  }

  public signUp(): any {
    console.log("signup");
    let data = {
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      email: this.email,
      mobileNumber: this.mobileNumber,
      country: this.countryCategory,
      countryCode: this.selectedCountryCode
    };

    console.log(data);

    this.service.signInFunction(data).subscribe(apiResponse => {
      console.log(apiResponse);

      if (apiResponse.status === 200) {
        // window.document.getElementById("exampleModal").click();
        this.firstName = "";
        this.lastName = "";
        this.password = "";
        this.email = "";
        this.mobileNumber = "";
        this.selectedCountryCode = "";
        this.countryCategory = "";

        this.toastr.success("Signup successful!!");
        this.router.navigate(["/login"]);
      } else {
        this.toastr.error(apiResponse.message);
      }
    });
  } // end of signUp
}
