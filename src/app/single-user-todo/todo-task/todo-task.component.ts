
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from 'src/app/services/todo.service';
import { Location } from '@angular/common';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-todo-task',
  templateUrl: './todo-task.component.html',
  styleUrls: ['./todo-task.component.css']
})
export class TodoTaskComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private toastr: ToastrService, private _service: TodoService,
    private location: Location) { }
  public title: string;
  public toDoListArray = [];
  public listId: string;
  public toDolistId: string;
  public toDoListItemArray = [];
  public editMode: boolean = false
  public authToken
  public taskId: string
  public listDetails: [];
  public parentName
  public currentUser: string

  ngOnInit() {
    this.toDolistId = this._route.snapshot.paramMap.get('listId');
    this.getAllToDoItems();
    let localStg = JSON.parse(localStorage.getItem('userInfo'));
    this.currentUser = localStg.userDetails.userId;
    this.authToken = localStg.authToken;

  }

  public getAllToDoItems = () => {
    console.log("token" + Cookie.get('authToken'))
    console.log("userId" + Cookie.get('userId'))
    this._service.getAllToDoListByParentId(this.toDolistId, Cookie.get('userId'), Cookie.get('authToken')).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          //this.toast.success('Parent List Found', 'Success');
          console.log(apiResponse)
          this.toDoListItemArray = apiResponse.data;
          console.log(apiResponse["data"]);
        } else {

          this.toastr.error(apiResponse.data.message, 'Error')
        }
      }
    );
  };//end of getAllToDoItems Function


  public editListoDo = (taskTodo) => {
    this.title = taskTodo.title;
    this.taskId = taskTodo.taskId;
    this.editMode = true;
    //alert('hii')
  };//end of editSubToDo function
  public createTodoItem = () => {
    console.log("Create log ")
    this.toDolistId = this._route.snapshot.paramMap.get('listId');
    if (this.editMode) {

      let todoitemData = {
        listId: this.toDolistId,
        title: this.title,
        isComplete: false,
        taskId: this.taskId,
        createdBy: Cookie.get('userId'),
        authToken: Cookie.get('authToken')
      }
      console.log('completeArray')
      console.log("listId: " + this.listId + "taskID:" + this.taskId)
      this._service.updatetask(todoitemData).subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success('Task Updated successfully', 'Success');
            this.title = '';
            this.editMode = false;
            this.getAllToDoItems();

          } else {
            this.toastr.error(apiResponse.message, 'Error')
          }
        }, (error) => {
          this.toastr.error(error["message"], 'Error')
        }
      );

      this.resetValuesToDefault();
    } else {
      let todoitemData = {
        listId: this.toDolistId,
        title: this.title,
        createdBy: Cookie.get('userId'),
        authToken: Cookie.get('authToken')
      };
      this._service.createToDoItem(todoitemData).subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success('Task create successfully', 'Success');
            this.title = '';
            this.getAllToDoItems();
          } else {
            this.toastr.error(apiResponse.message, 'Error')
          }
        }, (error) => {
          this.toastr.error(error["message"], 'Error')
        }
      );//end of service call

    }
    setTimeout(() => {

    }, 1000);
  };//end of createSubTodoItem function
  public goBackToPreviousPage(): any {
    this.location.back();
  };//end of goBackToPreviousPage function

  public resetValuesToDefault = () => {
    this.editMode = false;
    this.title = '';
  };//end of changeEditMode function

  public changeIsComplete = (taskData) => {

    let completeArray = {
      listId: taskData.listId,
      taskId: taskData.taskId,
      title: taskData.title,
      createdBy: Cookie.get('userId'),
      isComplete: !(taskData.isComplete),
      authToken: Cookie.get('authToken')
    }

    this._service.updatetask(completeArray).subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          this.toastr.success('Task Completed  successfully', 'Success');
          this.title = '';
          this.getAllToDoItems();
        } else {
          console.log(apiResponse)
          this.toastr.error(apiResponse.message, 'Error')
        }
      }, (error) => {
        console.log(error)
        this.toastr.error(error["message"], 'Error')
      }
    );//end of service call here
    //
  };//end of changeIsComplete functionco

  public deleteListById = (taskObj) => {
    let deleteObj = {
      listId: taskObj.listId,
      _id: taskObj._id,
      taskId: taskObj.taskId
    };
    if (confirm('Do you want to delete this list?')) {
      this._service.deleteTask(deleteObj, this.authToken).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            this.toastr.success('Task  deleted successfully', 'Success');
            //  this.toastr.success('Deleted successfully', 'Success');
            this.title = '';
            this.getAllToDoItems();
          } else {
            this.toastr.error(apiResponse.data.message, 'Error')
          }
        }
      );
    }

  };
}
