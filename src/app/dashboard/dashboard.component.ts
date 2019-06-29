import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from "./../services/todo.service"
import { ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _service: TodoService, private _route: ActivatedRoute,
    private toastr: ToastrService) { }
  authToken: string;
  currentUser = "";
  title: string = "";
  listId: string = "";
  toDoListArray: any[];
  toDoListTaskArray: any[]
  subToDoListItemArray: any[]

  ngOnInit() {
    let localStg = JSON.parse(localStorage.getItem('userInfo'));
    this.currentUser = localStg.userDetails.userId;
    this.authToken = localStg.authToken;
    this.getAllList()
  }
  public getAllList = () => {
    this.subToDoListItemArray = []
    this.toDoListTaskArray = []
    this._service.getToDoList(this.currentUser, this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          this.toDoListArray = apiResponse["data"];
        } else {
          this.toastr.error(apiResponse.message, 'Error')
        }
      }
    );
  }

  public getAllToDoTask = (toDolistId) => {
    this.subToDoListItemArray = []
    this._service.getAllToDoListByParentId(toDolistId, Cookie.get('userId'), Cookie.get('authToken')).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          this.toDoListTaskArray = apiResponse.data;
        } else {
          this.toastr.error(apiResponse.message, 'Error')
        }
      }
    );
  };//end of getAllToDoItems Function

  public getAllToDoSubTask = (taskId) => {

    this._service.getAllSubToDoListByParentId(this.listId, taskId, this.currentUser, Cookie.get('authToken')).subscribe(
      apiResponse => {
        console.log(apiResponse)
        if (apiResponse.status === 200) {
          this.subToDoListItemArray = apiResponse["data"];

        } else if (apiResponse.status === 204) {
          console.log("Error")
        }
        else {

        }
      }
    );
  }//end of getAllSubToDoItems
}
