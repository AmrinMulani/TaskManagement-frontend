import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/socket.service';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  userInfo: any;
  authToken: any;
  userName: any;
  verifyUser: Subscription
  multiToDo: Subscription
  friendReqNotification: Subscription
  friendAcceptNotification: Subscription
  constructor(public router: Router, public appService: AppService,
    private socketService: SocketService, private toastr: ToastrService) { }

  ngOnInit() {

    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.authToken = this.userInfo.authToken;
    this.userName = this.userInfo.userDetails.fullName;
    console.log('I am nav component')
    if (this.authToken !== '' || this.authToken !== null || this.authToken !== undefined) {
      this.verifyUserConfirmation();
      this.getFreindReqNotifications();
      this.getFriendAcceptNotification();
    }
  }
  getFriendAcceptNotification() {
    this.friendAcceptNotification = this.socketService
      .friendAcceptNotification(this.userInfo.userDetails.userId).subscribe(
        response => {
          console.log(response)
          this.toastr.success(response.message)
        },
        err => {
          this.toastr.error(err)
        }
      )
  }
  getFreindReqNotifications() {
    //socket to emit friend request send message
    this.friendReqNotification = this.socketService.friendReqNotification(this.userInfo.userDetails.userId).subscribe(
      response => {
        console.log(response)
        this.toastr.success(response.message)
      }
    )
    // socket to emit multi-todo create/edited messages
    this.multiToDo = this.socketService.multiToDoCreate(this.userInfo.userDetails.userId).subscribe(
      response => {
        console.log(response)
        this.toastr.success(response)
      }
    )
  }
  ngOnDestroy(): void {
    this.verifyUser.unsubscribe(); //unsubscribe observable
    this.multiToDo.unsubscribe();
    this.friendReqNotification.unsubscribe();
    this.friendAcceptNotification.unsubscribe();
  }

  public verifyUserConfirmation = () => {

    this.verifyUser = this.socketService.verifyUser().subscribe(
      response => {
        console.log('Hey I am inside verify user ' + response);
        this.socketService.setUser(this.authToken)
      }
    )
  }
  logout = () => {
    this.appService.logoutUser(this.userInfo.userDetails.userId, this.authToken).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        Cookie.delete('authToken');
        Cookie.delete('receiverId');
        Cookie.delete('receiverName');
        // while logout we need to clear localstorage
        localStorage.clear();

        this.socketService.disconnectSocket();
        this.toastr.success('Logged out successfully!!');
        this.router.navigate(['/']);
      }
      else if (apiResponse.message === 'User logged out already or user not registered') {
        this.toastr.error(apiResponse.message);
        this.router.navigate(['/']);
      }
      else {
        this.toastr.error(apiResponse.message);
        this.router.navigate(['/']);
      }
    });
  }; // end of logout
}
