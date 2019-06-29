import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { UsersModule } from "./users/users.module";
import { RouterModule, Router } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AlertModule, PaginationModule } from "ngx-bootstrap";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { LayoutModule } from "./layout/layout.module"
import { SingleUserTodoModule } from './single-user-todo/single-user-todo.module';


import { MultiUserTodoModule } from './multi-user-todo/multi-user-todo.module';
import { ErrorpageComponent } from './errorpage/errorpage.component';
@NgModule({
  declarations: [AppComponent, DashboardComponent, ErrorpageComponent],
  imports: [
    AlertModule.forRoot(),
    BrowserModule,
    AppRoutingModule,

    FormsModule,
    PaginationModule.forRoot(),
    UsersModule,
    LayoutModule,
    SingleUserTodoModule,

    MultiUserTodoModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
