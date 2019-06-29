import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
//Importing observables related code
import { Observable, throwError } from "rxjs";

import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MultitodoService {

  //private baseUrl = "http://localhost:3002/api/v1";
  private baseUrl = environment.baseUrl


  constructor(public http: HttpClient) { }

  public createMTodoList(data): any {
    const params = new HttpParams()
      .set("title", data.title)
      .set("createdBy", data.createdBy)
      .set('authToken', data.authToken)
      .set('remarks', data.remarks)
      .set('editBy', data.editBy);
    let response = this.http.post(`${this.baseUrl}/multitodo/createtodo`, params)
      .pipe(catchError(e => this.handleError(e)));
    return response;
  }
  public getMToDoList(userId, authToken): Observable<any> {
    return this.http.get(`${this.baseUrl}/multitodo/alltodo/${userId}?authToken=${authToken}`);

  }
  //for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
  getToDoTransactions(multiTodoId, skip, authToken): Observable<any> {
    return this.http.get(`${this.baseUrl}/multitodo/gethistory?multiToDoId=${multiTodoId}&skip=${skip}&authToken=${authToken}`)
      .pipe(catchError(e => this.handleError(e)));
  }

  public deleteMTodoList(listId, authToken): any {
    let response = this.http.post(`${this.baseUrl}/multitodo/deletetodo/${listId}?authToken=${authToken}`, null).pipe(catchError(e => this.handleError(e)));
    return response;
  };

  public undoMTodoList(listId, multitrnId, authToken): any {

    let response = this.http.post(`${this.baseUrl}/multitodo/undotodo/${listId}/${multitrnId}?authToken=${authToken}`, null).pipe(catchError(e => this.handleError(e)));
    return response;
  };

  completeMTodoList(data): Observable<any> {
    const params = new HttpParams()
      .set('multiToDoId', data.multiToDoId)
      .set('authToken', data.authToken)
      .set('isCompleted', data.isCompleted)

    //return null
    return this.http.put(`${this.baseUrl}/multitodo/completetodo`, params)
      .pipe(catchError(e => this.handleError(e)));
  };//end of updateSubToDo

  updateMTodoList(data): Observable<any> {
    const params = new HttpParams()
      .set('multiToDoId', data.multiToDoId)
      .set('title', data.title)
      .set('oldTitle', data.oldTitle)
      .set('authToken', data.authToken)
      .set('isCompleted', data.isCompleted)
      .set('editBy', data.editBy)
      .set('remarks', data.remarks);
    //return null
    return this.http.put(`${this.baseUrl}/multitodo/edittodo`, params)
      .pipe(catchError(e => this.handleError(e)));
  };//end of updateSubToDo
  //exception handle
  private handleError(err: HttpErrorResponse) {
    console.log(err)
    console.log("Handle Http calls error");
    console.log(err.error.message);
    return throwError(err.error);
  }
}
