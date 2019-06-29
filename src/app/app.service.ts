import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
//Importing observables related code
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class AppService {
  //private baseUrl = "http://localhost:3002/api/v1";
  private baseUrl = environment.baseUrl;


  constructor(public http: HttpClient) { }

  // for HTML5 local storage
  public setUserInfoInLocalStorage = data => {
    // converting the JSON into string and storing
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  public getUserInfoFromLocalStorage = () => {
    // getting back the string in the JSON format
    return JSON.parse(localStorage.getItem("userInfo"));
  };

  public signInFunction(data): any {
    const params = new HttpParams()
      .set("firstName", data.firstName)
      .set("lastName", data.lastName)
      .set("password", data.password)
      .set("email", data.email)
      .set("mobileNumber", data.mobileNumber)
      .set("country", data.country)
      .set("countryCode", data.countryCode);

    let response = this.http.post(`${this.baseUrl}/users/signup`, params);
    return response;
  }

  public loginFunction(data): any {
    const params = new HttpParams()
      .set("password", data.password)
      .set("email", data.email);

    let response = this.http.post(`${this.baseUrl}/users/login`, params);
    return response;
  }

  public resetPasswordFunction(data): any {
    const params = new HttpParams()
      .set("password", data.password)
      .set("email", data.email);

    let response = this.http.post(`${this.baseUrl}/users/resetpassword`, params);
    return response;
  }

  public authorizeUser(data): any {
    const params = new HttpParams()
      .set("forgotPassToken", data);

    let response = this.http.post(`${this.baseUrl}/users/authorizeUser`, params);
    return response;
  }

  public changePassword(data): any {
    const params = new HttpParams()
      .set("newPassword", data.newPassword)
      .set("userId", data.userId);

    let response = this.http.put(`${this.baseUrl}/users/changePassword`, params);
    return response;
  }

  public getListUser(userId, authToken): any {
    let response = this.http.get(
      `${this.baseUrl}/friendRequest/userlist/${userId}?authToken=${authToken}`
    );
    return response;
  }

  public getPendingUser(userId, authToken): any {
    let response = this.http.get(
      `${this.baseUrl}/friendRequest/viewfriend/request/sent/${userId}?authToken=${authToken}`
    );
    return response;
  }

  public forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/forgotpassword/${email}`, null)
      .pipe(catchError(e => this.handleError(e)));
  }
  public getFriendUser(userId, authToken): any {
    let response = this.http.get(
      `${this.baseUrl}/friendRequest/viewfriend/request/recieved/${userId}?authToken=${authToken}`
    );
    return response;
  }

  public getFriend(userId, authToken): any {
    let response = this.http.get(
      `${this.baseUrl}/friendRequest/view/friends/${userId}?authToken=${authToken}`);
    return response;
  }

  public logoutUser(userId, authToken): any {
    const params = new HttpParams()
      .set("userId", userId);
    let response = this.http.post(`${this.baseUrl}/users/logout?authToken=${authToken}`, params);
    return response;
  }

  public requesttoFriend(data): any {

    const params = new HttpParams()
      .set("senderId", data.senderId)
      .set("senderName", data.senderName)
      .set("recieverId", data.recieverId)
      .set("recieverName", data.recieverName)
      .set("authToken", data.authToken)

    let response = this.http.post(`${this.baseUrl}/friendRequest/send/friend/request`, params);
    return response;


  }


  public rejectFriend(data): any {

    const params = new HttpParams()
      .set("senderId", data.senderId)
      .set("senderName", data.senderName)
      .set("recieverId", data.recieverId)
      .set("recieverName", data.recieverName)
      .set("authToken", data.authToken)

    let response = this.http.post(`${this.baseUrl}/friendRequest/reject/friend/request`, params);
    return response;


  }
  public acceptFriend(data): any {

    const params = new HttpParams()
      .set("senderId", data.senderId)
      .set("senderName", data.senderName)
      .set("recieverId", data.recieverId)
      .set("recieverName", data.recieverName)
      .set("authToken", data.authToken)

    let response = this.http.post(`${this.baseUrl}/friendRequest/accept/friend/request`, params);
    return response;


  }

  //general exception handler for http request
  private handleError(err: HttpErrorResponse) {
    console.log("Handle error http calls");
    console.log(err.message);
    return Observable.throw(err.message);
  }
}
