import { Component, OnInit } from '@angular/core';
import { AppService } from "../../app.service";
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(private _service: AppService, private _route: ActivatedRoute, private socketService: SocketService,
    private toastr: ToastrService, ) { }

  userArray: any[];
  currentUser: string
  authToken: string
  pendingArray: any[];
  requestedArray: any[]
  requestArray: any[]
  friendArray: any[]
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  currentuserName: string
  friendlist: any[]
  userInfo: any
  sendFriend: any[]

  ngOnInit() {
    let localStg = JSON.parse(localStorage.getItem('userInfo'));
    this.currentUser = localStg.userDetails.userId;
    this.userInfo = this._service.getUserInfoFromLocalStorage()
    this.currentuserName = localStg.userDetails.fullName
    console.log('\n\n\ncurrentusername ' + this.currentuserName)
    this.authToken = localStg.authToken;
    this.getUserList()
    this.getPendingList()
    this.getFriendrequest()
    this.getFriendlist()
    this.friendlist = localStg.userDetails


  }


  public getUserList = () => {


    this._service.getListUser(this.currentUser, this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {

          this.userArray = apiResponse["data"];
          console.log("userlist")


          console.log(this.userArray);
        } else {
          console.log(apiResponse.message)
        }
      }
    );
  }

  public getPendingList = () => {

    this._service.getPendingUser(this.currentUser, this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          //this.toast.success('Parent Lis4t Found', 'Success');
          console.log("Pending")
          this.pendingArray = apiResponse.data[0].friendRequestSent;

          console.log(this.pendingArray);

        } //else {
        // this.toastr.error(apiResponse.data.message, 'Error')
        //}
      }
    );
  }

  public getFriendrequest = () => {

    this._service.getFriendUser(this.currentUser, this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          //this.toast.success('Parent Lis4t Found', 'Success');
          this.requestArray = apiResponse["data"].friendRequestRecieved;
          console.log("request")
          console.log(apiResponse["data"])
          // this.pendingArray = pendingArray1.friendRequestSent;
          console.log(this.requestArray);
          this.getFriendlist();
        }

      }
    );
  }


  public getFriendlist = () => {
    console.log("friends")
    console.log(Cookie.get('userId'))
    this._service.getFriend(Cookie.get('userId'), this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          //this.toast.success('Parent Lis4t Found', 'Success');
          this.friendArray = apiResponse["data"];
          console.log("friends")
          console.log(apiResponse["data"])

          console.log(this.friendArray);

        }// else {
        //this.toastr.error(apiResponse.message, 'Error')
        //} 
      }
    );
  }

  public acceptedFriend = (friend) => {


    let data = {
      senderId: friend.friendId,
      senderName: friend.friendName,
      recieverId: Cookie.get('userId'),
      recieverName: Cookie.get('receiverName'),
      authToken: Cookie.get('authToken')
    }

    this._service.acceptFriend(data).subscribe(
      (apiResponse) => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this.toastr.success('Friendrequest Accept  successfully', 'Success');

          this.requestArray = this.requestArray.filter(x => x.friendId !== friend.friendId);

          this.getUserList()
          this.getFriendrequest()
          this.getFriendlist()

          //emit socket to notify user
          let receiverInfo = {
            userName: Cookie.get('receiverName'),
            senderId: friend.friendId
          }

          this.socketService.sendFriendAccept(receiverInfo);


        } else {
          console.log(apiResponse)
          this.toastr.error('There is some problem ', 'Error')
        }
      },
    );//end of service call

  }

  public sendFriendRequest = (friend) => {
    console.log("send Friend")
    console.log(friend.userId, friend.fullName)
    console.log(Cookie.get('receiverName'))
    let data = {
      senderId: Cookie.get('userId'),
      senderName: Cookie.get('receiverName'),
      recieverId: friend.userId,
      recieverName: friend.fullName,
      authToken: Cookie.get('authToken')
    }
    console.log("Receiverid" + data.recieverName)
    this._service.requesttoFriend(data).subscribe(
      (apiResponse) => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this.toastr.success('Friend request sent successfully', 'Success');
          this.userArray = this.userArray.filter(x => x.userId !== friend.userId);
          let senderInfo = {
            userName: Cookie.get('receiverName'),
            senderId: Cookie.get('userId'),
            receiverId: friend.userId
          }
          //sender info passed in socket service event 'friend-info'
          this.socketService.sendFriendReqeuestInfo(senderInfo)


          this.getUserList()
          this.getPendingList()
        } else {
          console.log(apiResponse)
          this.toastr.error("There is some problem with send friend request", 'Error')
        }
      },// (error) => {

    );//end of service call
  }


  public rejectFriendRequest = (friend) => {
    console.log("reject Friend")
    console.log(friend.friendId, friend.friendName)
    console.log(Cookie.get('receiverName'))
    if (confirm('Do you really want to delete this item?')) {
      let data = {
        senderId: Cookie.get('userId'),
        senderName: Cookie.get('receiverName'),
        recieverId: friend.friendId,
        recieverName: friend.friendName,
        authToken: Cookie.get('authToken')
      }
      console.log("Receiverid" + data.recieverName)
      this._service.rejectFriend(data).subscribe(
        (apiResponse) => {
          console.log(apiResponse);
          if (apiResponse.status === 200) {
            this.getUserList()
            this.toastr.success("Request has Decline", 'Success')
          } else {
            console.log(apiResponse)
            this.toastr.error("There is problem to reject the request", 'Error')
          }
        }, (error) => {
          console.log(error)
          this.toastr.error(error["message"], 'Error')
        }
      );//end of service call
    }

  }
}