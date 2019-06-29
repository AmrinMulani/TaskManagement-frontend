import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from 'src/app/services/todo.service';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-todo-subtask',
  templateUrl: './todo-subtask.component.html',
  styleUrls: ['./todo-subtask.component.css']
})
export class TodoSubtaskComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _toastr: ToastrService,
    private _service: TodoService,
    private location: Location) { }

  public parentName: string;
  public title: string;
  public subToDoListItemArray: any = [];
  public listId: string;
  public _id: string;
  public taskId: string;
  public subTaskId: string;
  public editMode: boolean = false;
  public authToken
  public currentUser: string;

  public finalArray = [];
  //public model = new SubToDo();
  ngOnInit() {
    this.listId = this._route.snapshot.paramMap.get('listId');
    this.taskId = this._route.snapshot.paramMap.get('taskID');
    let localStg = JSON.parse(localStorage.getItem('userInfo'));
    this.currentUser = localStg.userDetails.userId;
    this.authToken = localStg.authToken;
    this.getAllSubToDoItems();

  }

  public getAllSubToDoItems = () => {
    this.subToDoListItemArray = "";

    this._service.getAllSubToDoListByParentId(this.listId, this.taskId, this.currentUser, Cookie.get('authToken')).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          this.subToDoListItemArray = apiResponse["data"];
          let arrAllData = apiResponse["data"];
          this.parentName = arrAllData.title;
        } else if (apiResponse.status === 204) {
        }
        else {
          this._toastr.error("NO Data present ", 'Error')
        }
      }
    );
  }//end of getAllSubToDoItems

  public createSubTodoItem = () => {
    if (this.editMode) {
      let subToDoitemData = {
        subTaskId: this.subTaskId,
        title: this.title,
        createdBy: Cookie.get('userId'),
        isComplete: false,
        listId: this.listId,
        taskId: this.taskId,
        authToken: Cookie.get('authToken'),

      };

      this._service.updateSubToDoItem(subToDoitemData).subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this._toastr.success('SubTask Updated successfully', 'Success');
            this.title = ''; this.editMode = false;
            this.getAllSubToDoItems();
          } else {
            this._toastr.error(apiResponse.message, 'Error')
          }
        }, (error) => {
          console.log(error)
          this._toastr.error(error["message"], 'Error')
        }
      );

      this.resetValuesToDefault();
    } else {
      let subToDoitemData = {
        listId: this.listId,
        taskId: this.taskId,
        title: this.title,
        createdBy: Cookie.get('userId'),
        authToken: Cookie.get('authToken')
      };

      console.log(subToDoitemData)
      this._service.createSubToDoItem(subToDoitemData).subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this._toastr.success('SubTask Created successfully', 'Success');
            this.title = '';
            this.getAllSubToDoItems();
          } else {
            this._toastr.error(apiResponse.message, 'Error')
          }
        }, (error) => {
          this._toastr.error(error["message"], 'Error')
        }
      );//end of service call

    }

  };//end of createSubTodoItem function

  public goBackToPreviousPage(): any {
    this.location.back();
  };//end of goBackToPreviousPage function

  public deleteSubToDo = (subData) => {

    if (confirm('Do you really want to delete this SubTask?')) {
      let taskId1 = this._route.snapshot.paramMap.get('taskID');

      let deleteObj = {
        listId: subData.listId,
        _id: subData._id,
        subTaskId: subData.subTaskId,
      };

      let authToken1 = Cookie.get('authToken')
      this._service.deleteSubToDo(deleteObj, taskId1, authToken1).subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this._toastr.success('SubTask Deleted successfully', 'Success');
            this.title = '';
            this.getAllSubToDoItems();
          } else {
            this._toastr.error(apiResponse.message, 'Error')
          }
        }, (error) => {
          console.log(error)
          this._toastr.error(error["message"], 'Error')
        });//end of service call

    };//user confirmation for deletion
  };//end of deleteSubToDo function

  //start of editSubToDo function
  public editSubToDo = (subtodo) => {
    this.title = subtodo.title;
    this.subTaskId = subtodo.subTaskId;
    console.log(this.subTaskId);
    this.editMode = true;
  };//end of editSubToDo function

  //start of changeEditMode
  public resetValuesToDefault = () => {
    this.editMode = false;
    this.title = '';
  };//end of changeEditMode function

  //start of changeIsComplete function

  public changeIsComplete = (subToDoData) => {

    let completeArray = {
      listId: this.listId,
      taskId: this.taskId,
      subTaskId: subToDoData.subTaskId,
      title: subToDoData.title,
      createdBy: Cookie.get('userId'),
      isComplete: !(subToDoData.isComplete),
      createdOn: Date.now(),
      authToken: Cookie.get('authToken')
    }
    this._service.updateSubToDoItem(completeArray).subscribe(
      (apiResponse) => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this._toastr.success('SubTask Completed successfully', 'Success');
          this.title = '';
          this.getAllSubToDoItems();
        } else {
          console.log(apiResponse)
          this._toastr.error(apiResponse.message, 'Error')
        }
      }, (error) => {
        console.log(error)
        this._toastr.error(error["message"], 'Error')
      }
    );//end of service call here
    //
  };//end of changeIsComplete function

}
