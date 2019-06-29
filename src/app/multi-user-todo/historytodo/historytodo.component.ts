import { Component, OnInit, HostListener } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MultitodoService } from 'src/app/services/multitodo.service';
import { multicast } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-historytodo',
  templateUrl: './historytodo.component.html',
  styleUrls: ['./historytodo.component.css']
})
export class HistorytodoComponent implements OnInit {
  toDoId: string;
  historyToDo: any
  historyTrans: any[]
  returnedArray: any[];
  authToken: string
  totalRec: number;
  currentPage = 1;
  page: number = 1;
  skip: number = 0
  multiId: string
  multitrnId: string

  constructor(private _service: AppService, private _route: ActivatedRoute, private multiservice: MultitodoService, private location: Location,
    private toastr: ToastrService) { }
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    //for windows
    if (event.ctrlKey && event.keyCode === 90) {
      this.historyTrans.length > 1 ?
        this.undoList() : this.toastr.info('Nothing to undo')
    }
    //for mac
    if (event.metaKey && event.keyCode === 90) {
      this.historyTrans.length > 1 ?
        this.undoList() : this.toastr.info('Nothing to undo')
    }
  }
  ngOnInit() {
    this.toDoId = this._route.snapshot.paramMap.get('id');
    //this.getToDoTransaction(this.toDoId)
    let localStg = JSON.parse(localStorage.getItem('userInfo'));

    this.getToDoTransaction()

  }
  undoList = () => {
    let obj = this.historyTrans[0];
    this.multiId = obj.multiToDoId
    this.multitrnId = obj.trnId
    this.authToken = Cookie.get("authToken")
    if (confirm('Do you want to undo this list?')) {
      this.multiservice.undoMTodoList(this.multiId, this.multitrnId, this.authToken).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            this.toastr.success('Undo list successfully ', 'Success');
            this.getToDoTransaction()
          } else {
            this.toastr.error("Unable to Undo list ", 'Error')
          }
        },
        error => {
          console.log(error)
          this.toastr.error(error["message"], 'Error')
        }
      );
    }
  };

  pageChanged(event: any): void {
    this.skip = (event.page - 1) * 5
    this.getToDoTransaction()

  }

  getToDoTransaction(): any {
    this.authToken = Cookie.get("authToken")
    console.log(this.authToken)
    this.multiservice.getToDoTransactions(this.toDoId, this.skip, this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          this.historyToDo = apiResponse.data;
          this.historyTrans = this.historyToDo.transcList
          this.totalRec = this.historyToDo.countHistory
          if (this.historyToDo === 0)
            this.toastr.warning('No transactions found on this todo!!')
        } else {
          this.toastr.error(apiResponse.message, 'Error')
        }
      },
      error => {
        console.log(error)
        this.toastr.error(error["message"], 'Error')
      }
    );
  }
  public goBackToPreviousPage(): any {
    this.location.back();
  };//end of goBackToPreviousPage function

}
