import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = environment.socketUrl;

  private socket: any;
  constructor(private http: HttpClient) { }

  //events to be listened


  public verifyUser = (): Observable<any> => {
    //handshake
    this.socket = io(this.url)
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data)
      }) //end socket
    }) //end observerable
  } //end verifyUser method


  //socket for friend request sent notification
  public friendReqNotification = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (notification) => {
        observer.next(notification);
      }); //end Socket
    }); //end Observable
  }

  //socket for friend request accepted notification
  public friendAcceptNotification = (userId) => {
    // this.socket.removeAllListeners(['fRAccept'+userId])
    return Observable.create((observer) => {
      this.socket.on('fRAccept' + userId, (notification) => {
        observer.next(notification)
      })
    })
  }

  //socket for multi create
  public multiToDoCreate = (userId) => {
    // this.socket.removeAllListeners(['create'+userId]);
    return Observable.create((observer) => {
      this.socket.on('create' + userId, (notification) => {
        observer.next(notification)
      })
    })
  }


  //events to be emitted

  public setUser = (authToken) => {
    this.socket.emit('set-user', (authToken))
  } //end setUser

  public sendFriendReqeuestInfo = (senderInfo: any) => {
    console.log(senderInfo);
    this.socket.emit('friend-req-send', (senderInfo))
  }

  public sendFriendAccept = (receiverInfo: any) => {
    console.log(receiverInfo)
    this.socket.emit('friend-accept-request', (receiverInfo))
  }

  public sendMultiTodoInfo = (data) => {
    this.socket.emit('multi-todo-create', (data))
  }
  public disconnectSocket = () => {
    this.socket.emit('logout')
  }
}
