import { Component, TemplateRef, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MultitodoService } from 'src/app/services/multitodo.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-viewtodo',
  templateUrl: './viewtodo.component.html',
  styleUrls: ['./viewtodo.component.css']
})
export class ViewtodoComponent implements OnInit {

  constructor(private _service: AppService, private _route: ActivatedRoute, private multiservice: MultitodoService, private modalService: BsModalService,
    private toastr: ToastrService, private socketService: SocketService) { }
  authToken: string
  modalRef: BsModalRef;
  friendArray: any
  friendNewArray: any[]
  historyToDo: any[]
  title1: string = "";
  createdBy: string
  multiToDoId1: string = "";
  public editMode: boolean = false;
  title: string
  oldtitle: string
  userInfo
  toDoListArray: any[]
  currentUser: string
  currentuserName: string;
  selectedFriend: string;
  ngOnInit() {
    let localStg = JSON.parse(localStorage.getItem('userInfo'));
    this.currentUser = localStg.userDetails.userId;
    this.userInfo = this._service.getUserInfoFromLocalStorage()
    this.currentuserName = localStg.userDetails.fullName
    console.log('\n\n\ncurrentusername ' + this.currentuserName)
    this.authToken = localStg.authToken;
    this.getTodo(this.currentUser);

    this.getFriendlist()
    console.log("\n\n")
  }

  public getFriendlist = () => {
    console.log("friends")
    console.log(Cookie.get('userId'))
    this._service.getFriend(Cookie.get('userId'), this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {

          this.friendArray = apiResponse["data"];
          this.friendNewArray = this.friendArray.friends;
          let curentPerson = {
            friendId: this.currentUser,
            friendName: "My List"
          }
          this.friendNewArray.unshift(curentPerson)
          console.log("friends")
          console.log(apiResponse["data"])
          console.log(this.friendNewArray)
          console.log(this.friendArray);

        }// else {
        //this.toastr.error(apiResponse.message, 'Error')
        //} 
      }
    );
  }

  public getAllList = (id) => {
    // console.log('get list' + this.)
    this.multiservice.getMToDoList(id, this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {

          this.toDoListArray = apiResponse["data"];
          console.log("list todo")
          console.log(this.toDoListArray);
        } else {
          this.toastr.error(apiResponse.message, 'Error')
        }
      }
    );
  }

  getTodo = (id) => {
    this.selectedFriend = id;
    console.log("Get List ")
    this.getAllList(id)

  }
  public editListToDo = (template: TemplateRef<any>, listTodo, oldtitle1) => {
    console.log(listTodo)
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.title = listTodo.title;
    this.oldtitle = oldtitle1
    this.multiToDoId1 = listTodo.multiToDoId;
    this.createdBy = listTodo.createdBy
    this.editMode = true;

  };
  updateToDo = () => {
    let todoObj = {
      multiToDoId: this.multiToDoId1,
      title: this.title,
      oldTitle: this.oldtitle,
      authToken: this.authToken,
      editBy: this.currentuserName,
      remarks: `Todo '${this.oldtitle}' changed to '${this.title.toUpperCase()}' by  '${this.currentuserName}'`,
    };
    this.editItem(todoObj);
  }
  editItem = (todoObj) => {

    this.multiservice.updateMTodoList(todoObj).subscribe(
      apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {

          this.toastr.success('Updated successfully', 'Success');

          this.getTodo(this.createdBy);
          const obj = {
            message: todoObj.remarks,
            senderId: this.currentUser,
            createdBy: this.createdBy
          };
          this.socketService.sendMultiTodoInfo(obj)
          this.modalRef.hide();
        } else {

          console.log(apiResponse)

          this.toastr.error(apiResponse.message, 'Error')
        }
      },
      error => {
        console.log(error)
        this.toastr.error(error["message"], 'Error')
      }
    );//end of service call
  };//end of editItem function
  decline(): void {

    this.modalRef.hide();
  }
  public changeIsComplete = (listData) => {

    let completeArray = {
      multiToDoId: listData.multiToDoId,
      isCompleted: !(listData.isCompleted),
      authToken: this.authToken
    }
    console.log('completeArray')
    console.log(completeArray)
    this.multiservice.completeMTodoList(completeArray).subscribe(
      (apiResponse) => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this.toastr.success('list Complete update successfully', 'Success');
          this.getTodo(listData.createdBy)
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
  };//end of changeIsComplete function*/
  public deleteList = (listObj) => {
    if (confirm('Do you want to delete this list?')) {
      this.multiservice.deleteMTodoList(listObj.multiToDoId, this.authToken).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            this.toastr.success('List deleted successfully', 'Success');
            this.getTodo(this.createdBy);

          } else {
            this.toastr.error(apiResponse.message, 'Error')
          }
        }
      );
    }

  };
}
