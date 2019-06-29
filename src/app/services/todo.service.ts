import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
//Importing observables related code
import { Observable, throwError } from "rxjs";

import { catchError } from 'rxjs/operators';
import { pureFunction1 } from '@angular/core/src/render3';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  //private baseUrl = "http://localhost:3002/api/v1";
  private baseUrl = environment.baseUrl

  constructor(public http: HttpClient) { }


  // for HTML5 local storage
  public setListInfoInLocalStorage = data => {
    // converting the JSON into string and storing
    localStorage.setItem("ListInfo", JSON.stringify(data));
  };


  public getListInfoFromLocalStorage = () => {
    // getting back the string in the JSON format
    return JSON.parse(localStorage.getItem("ListInfo"));
  };
  getSToDoList() {
    return JSON.parse(localStorage.getItem('data'))
  };

  public getToDoList(userId, authToken): Observable<any> {
    console.log("Get List " + userId)
    return this.http.get(`${this.baseUrl}/todo/allList/${userId}?authToken=${authToken}`);

  }


  //delete the list 

  public deleteListById(listId, authToken): any {
    let response = this.http.post(`${this.baseUrl}/todo/deletelist/${listId}?authToken=${authToken}`, null).pipe(catchError(e => this.handleError(e)));
    return response;
  };

  public deleteTask(data, authToken1): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('taskId', data.taskId)
      .set('_id', data._id)
      .set('authToken', authToken1);
    console.log(data._id, data.taskId)
    console.log(data.listId)
    return this.http.post(`${this.baseUrl}/todo/delitemtodo`, params)
      .pipe(catchError(e => this.handleError(e)));
  }
  //delete the subtask 

  public deleteSubToDo(data, taskId1, authToken1): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('taskId', taskId1)
      .set('_id', data._id)
      .set('subTaskId', data.subTaskId)
      .set('authToken', authToken1);
    console.log(data._id)

    return this.http.post(`${this.baseUrl}/todo/delsubitemtodo`, params)
      .pipe(catchError(e => this.handleError(e)));
  }

  public createTodoList(data): any {
    const params = new HttpParams()
      .set("title", data.title)
      .set("createdBy", data.createdBy)
      .set('authToken', data.authToken)

    let response = this.http.post(`${this.baseUrl}/todo/createtodo`, params)
      .pipe(catchError(e => this.handleError(e)));


    return response;
  }

  //item of list 
  public getAllToDoListByParentId(listId, userId, authToken): Observable<any> {
    return this.http.get(`${this.baseUrl}/todo/gettask/${listId}/${userId}?authToken=${authToken}`).pipe(catchError(e => this.handleError(e)));
  }



  //todo item create HTTPPost
  getAllSubToDoListByParentId(parentId, toDoId, userId, authToken): Observable<any> {
    return this.http.get(`${this.baseUrl}/todo/getsubitem/${toDoId}/${userId}?authToken=${authToken}`).pipe(catchError(e => this.handleError(e)));
  };//end of getAllSubtodo items

  public createToDoItem(data): Observable<any> {
    const params = new HttpParams()
      .set('title', data.title)
      .set('createdBy', data.createdBy)
      .set('listId', data.listId)
      .set('authToken', data.authToken);
    return this.http.post(`${this.baseUrl}/todo/createItem`, params)
      .pipe(catchError(e => this.handleError(e)));
  };

  //todo item create HTTPPost
  public createSubToDoItem(data): Observable<any> {
    const params = new HttpParams()
      .set('title', data.title)
      .set('createdBy', data.createdBy)
      .set('listId', data.listId)
      .set('taskId', data.taskId)
      .set('authToken', data.authToken);

    return this.http.post(`${this.baseUrl}/todo/createsubitem`, params)
      .pipe(catchError(e => this.handleError(e)));
  };//end of createSubToDoItem

  updateSubToDoItem(data): Observable<any> {
    const params = new HttpParams()
      .set('subTaskId', data.subTaskId)
      .set('createdBy', data.createdBy)
      .set('listId', data.listId)
      .set('title', data.title)
      .set('taskId', data.taskId)
      .set('authToken', data.authToken)
      .set('isComplete', data.isComplete);
    //return null
    return this.http.post(`${this.baseUrl}/todo/updsubitemtodo`, params)
      .pipe(catchError(e => this.handleError(e)));
  };//end of updateSubToDo

  updatetask(data): Observable<any> {
    const params = new HttpParams()

      .set('createdBy', data.createdBy)
      .set('listId', data.listId)
      .set('title', data.title)
      .set('taskId', data.taskId)
      .set('authToken', data.authToken)
      .set('isComplete', data.isComplete);
    console.log(params)

    return this.http.put(`${this.baseUrl}/todo/uptasktodo`, params)
      .pipe(catchError(e => this.handleError(e)));
  };//end of updateSubToDo

  updateList(data): Observable<any> {
    const params = new HttpParams()
      .set('createdBy', data.createdBy)
      .set('listId', data.listId)
      .set('title', data.title)
      .set('authToken', data.authToken)
      .set('isComplete', data.isComplete);

    //return null
    return this.http.put(`${this.baseUrl}/todo/uplisttodo`, params)
      .pipe(catchError(e => this.handleError(e)));
  };//end of update

  //exception handl
  private handleError(err: HttpErrorResponse) {
    console.log(err)
    console.log("Handle Http calls error");
    console.log(err.error.message);
    return throwError(err.error);
  }

}
