import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewtodoComponent } from './viewtodo/viewtodo.component';
import { LayoutModule } from '../layout/layout.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CreatetodoComponent } from './createtodo/createtodo.component';
import { HistorytodoComponent } from './historytodo/historytodo.component';
import { PaginationModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [ViewtodoComponent, CreatetodoComponent, HistorytodoComponent],
  imports: [
    CommonModule, LayoutModule, FormsModule, RouterModule, PaginationModule.forRoot(),
  ]
})
export class MultiUserTodoModule { }
