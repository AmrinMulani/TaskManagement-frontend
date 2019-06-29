import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { MultitodoService } from 'src/app/services/multitodo.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-createtodo',
  templateUrl: './createtodo.component.html',
  styleUrls: ['./createtodo.component.css']
})
export class CreatetodoComponent implements OnInit {


  constructor(private _service: TodoService, private _route: ActivatedRoute, private multiservice: MultitodoService,
    private toastr: ToastrService,
    private socketService: SocketService) { }
  authToken: string;
  currentUser = "";
  title: string = "";
  multiToDoId: string = "";
  toDoListArray: any[];
  historyToDo: any[]
  currentTodo: any = [];
  public editMode: boolean = false;
  currentuserName
  oldtitle: string
  ngOnInit() {

    //getting data from local storage
    let localStg = JSON.parse(localStorage.getItem('userInfo'));
    this.currentUser = localStg.userDetails.userId;
    this.currentuserName = localStg.userDetails.fullName
    this.authToken = localStg.authToken;
    this.getAllList()

  }


  //get list 
  public getAllList = () => {

    this.multiservice.getMToDoList(this.currentUser, this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {

          this.toDoListArray = apiResponse["data"];

        } else {
          this.toastr.error(apiResponse.message, 'Error')
        }
      }
    );
  }

  //delete the list 
  public deleteList = (listObj) => {

    if (confirm('Do you want to delete this list?')) {
      this.multiservice.deleteMTodoList(listObj.multiToDoId, this.authToken).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            this.toastr.success('List deleted successfully', 'Success');
            this.getAllList()
          } else {
            this.toastr.error(apiResponse.message, 'Error')
          }
        }
      );
    }

  };

  public saveToDoItem = () => {
    if (this.editMode) {
      let todoObj = {
        multiToDoId: this.multiToDoId,
        title: this.title,
        oldTitle: this.oldtitle,
        authToken: this.authToken,
        editBy: this.currentuserName,
        remarks: `Todo '${this.oldtitle}' changed to '${this.title.toUpperCase()}' by  '${this.currentuserName}'`,
        isCompleted: this.currentTodo.isCompleted
      };
      this.editItem(todoObj);
    } else {

      let todoObj = {
        title: this.title,
        authToken: this.authToken,
        createdBy: this.currentUser,
        editBy: this.currentuserName,
        remarks: `Todo '${this.title.toUpperCase()}' created by  ${this.currentuserName}`
      };
      this.saveItem(todoObj);
    }

  };//end of addItemFunction

  editItem = (todoObj) => {
    this.multiservice.updateMTodoList(todoObj).subscribe(
      apiResponse => {

        if (apiResponse.status === 200) {
          this.resetValuesToDefault();
          this.toastr.success('Updated successfully', 'Success');

          this.getAllList();

          const obj = {
            message: todoObj.remarks,
            senderId: this.currentUser
          };
          this.socketService.sendMultiTodoInfo(obj)
        } else {
          this.toastr.error(apiResponse.message, 'Error')
        }
      },
      error => {

        this.toastr.error(error["message"], 'Error')
      }
    );//end of service call
  };//end of editItem function
  saveItem = (todoObj) => {
    this.multiservice.createMTodoList(todoObj).subscribe(
      apiResponse => {

        if (apiResponse.status === 200) {
          this.resetValuesToDefault();
          this.toastr.success('Saved successfully', 'Success');

          //socket call
          const obj = {
            message: todoObj.remarks,
            senderId: todoObj.createdBy
          };
          this.socketService.sendMultiTodoInfo(obj)
          this.getAllList();
        } else {
          this.toastr.error(apiResponse.message, 'Error')
        }
      },
      error => {
        this.toastr.error(error["message"], 'Error')
      }
    );//end of service call
  }
  public editListToDo = (listTodo, oldtitle1) => {
    this.title = listTodo.title;
    this.oldtitle = oldtitle1
    this.multiToDoId = listTodo.multiToDoId;
    this.editMode = true;

  };//end of editSubToDo function

  //start of changeEditMode
  public resetValuesToDefault = () => {
    this.editMode = false;
    this.title = '';
  };//end of changeEditMode function


  public changeIsComplete = (listData) => {

    let completeArray = {
      multiToDoId: listData.multiToDoId,
      isCompleted: !(listData.isCompleted),
      authToken: this.authToken
    }

    this.multiservice.completeMTodoList(completeArray).subscribe(
      (apiResponse) => {

        if (apiResponse.status === 200) {
          this.getAllList()
          this.toastr.success('list Complete update successfully', 'Success');
          this.title = '';
          //this.getAllList
        } else {

          this.toastr.error(apiResponse.message, 'Error')
        }
      }, (error) => {

        this.toastr.error(error["message"], 'Error')
      }
    );//end of service call here
    //
  };//end of changeIsComplete function*/

}
