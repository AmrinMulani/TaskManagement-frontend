import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from "./../../services/todo.service"
import { ActivatedRoute } from '@angular/router';
//import { currentId } from 'async_hooks';
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  constructor(private _service: TodoService, private _route: ActivatedRoute,
    private toastr: ToastrService) { }
  authToken: string;
  currentUser = "";
  title: string = "";
  listId: string = "";
  toDoListArray: any[];
  public editMode: boolean = false;

  ngOnInit() {

    //getting data from local storage
    let localStg = JSON.parse(localStorage.getItem('userInfo'));
    this.currentUser = localStg.userDetails.userId;
    this.authToken = localStg.authToken;

    console.log(this.currentUser)
    console.log(this.authToken)
    this.getAllList()

  }

  //create new one 
  public addItem1 = () => {

    const todoObj = {
      title: this.title,
      createdBy: this.currentUser,
      authToken: this.authToken
    }
    this._service.createTodoList(todoObj).subscribe(
      apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this.title = '';

          this.toastr.success('Saved successfully', 'Success');

          //getting new list from backend
          this.getAllList();
        } else {
          console.log(apiResponse)
          //alert(apiResponse.message)
          this.toastr.error(apiResponse.message, 'Error')
        }
      },
      error => {
        console.log(error)
        this.toastr.error(error["message"], 'Error')
      }
    );//end of service call


  };//end of addItemFunction

  //get list 
  public getAllList = () => {

    this._service.getToDoList(this.currentUser, this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {

          this.toDoListArray = apiResponse["data"];
          console.log(this.toDoListArray);
        } else {
          this.toastr.info(apiResponse.message)
        }
      }
    );
  }

  //delete the list 
  public deleteListById = (listObj) => {

    if (confirm('Do you want to delete this list?')) {
      this._service.deleteListById(listObj.listId, this.authToken).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            this.toastr.success('List deleted successfully', 'Success');
            //this.toDoListArray = apiResponse["data"];

            //deleting item from todoListArray
            this.toDoListArray = this.toDoListArray.filter(x => x.listId !== listObj.listId)
          } else {
            this.toastr.error(apiResponse.message, 'Error')
          }
        }
      );
    }

  };
  //edit and update 

  public addItem = () => {
    //

    if (this.editMode) {

      let listData = {

        listId: this.listId,
        title: this.title,
        createdBy: this.currentUser,
        isComplete: false,
        authToken: this.authToken

      };

      this._service.updateList(listData).subscribe(
        (apiResponse) => {

          if (apiResponse.status === 200) {
            this.toastr.success('Updated successfully', 'Success');
            this.title = ''; this.editMode = false;
            this.getAllList();


          }
        }, (error) => {

          this.toastr.error(error["message"], 'Error')
        }
      );

      this.resetValuesToDefault();
    } else {
      let todoObj = {
        listId: this.listId,

        title: this.title,
        createdBy: this.currentUser,
        authToken: this.authToken
      };

      this._service.createTodoList(todoObj).subscribe(
        (apiResponse) => {

          if (apiResponse.status === 200) {
            this.toastr.success('List Created successfully', 'Success');
            this.title = '';
            this.getAllList();
          } else {

            this.toastr.error(apiResponse.message, 'Error')
          }
        }, (error) => {

          this.toastr.error(error["message"], 'Error')
        }
      );//end of service call

    }

  };//end of createSubTodoItem function

  public editListToDo = (listTodo) => {
    this.title = listTodo.title;
    this.listId = listTodo.listId;
    this.editMode = true;

  };//end of editSubToDo function

  //start of changeEditMode
  public resetValuesToDefault = () => {
    this.editMode = false;
    this.title = '';
  };//end of changeEditMode function


  public changeIsComplete = (listData) => {
    let completeArray = {
      listId: listData.listId,
      title: listData.title,
      createdBy: this.currentUser,
      isComplete: !(listData.isComplete),

      authToken: this.authToken
    }

    this._service.updateList(completeArray).subscribe(
      (apiResponse) => {

        if (apiResponse.status === 200) {
          this.getAllList()
          this.toastr.success('List Updated successfully', 'Success');
          this.title = '';

        } else {

          this.toastr.error(apiResponse.message, 'Error')
        }
      }, (error) => {

        this.toastr.error(error["message"], 'Error')
      }
    );//end of service call here
    //
  };//end of changeIsComplete function
}
