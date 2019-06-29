import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ErrorpageComponent } from "./errorpage/errorpage.component"
import { LoginpageComponent } from "./users/loginpage/loginpage.component";
import { SignuppageComponent } from "./users/signuppage/signuppage.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ForgetpasswordComponent } from "./users/forgetpassword/forgetpassword.component"
import { ResetpasswordComponent } from "./users/resetpassword/resetpassword.component"
import { TodoListComponent } from './single-user-todo/todo-list/todo-list.component';
import { TodoTaskComponent } from './single-user-todo/todo-task/todo-task.component';
import { TodoSubtaskComponent } from './single-user-todo/todo-subtask/todo-subtask.component';
import { FriendsComponent } from "./users/friends/friends.component"
import { ViewtodoComponent } from "./multi-user-todo/viewtodo/viewtodo.component"
import { CreatetodoComponent } from "./multi-user-todo/createtodo/createtodo.component"
import { HistorytodoComponent } from './multi-user-todo/historytodo/historytodo.component'

const routes: Routes = [
  { path: "login", component: LoginpageComponent, pathMatch: "full" },
  { path: "signup", component: SignuppageComponent, pathMatch: "full" },
  { path: "friend", component: FriendsComponent, pathMatch: "full" },
  { path: "home", component: DashboardComponent, pathMatch: "full" },
  { path: 'list', component: TodoListComponent, pathMatch: 'full' },
  { path: 'subtodo/:listId/:taskID', component: TodoSubtaskComponent, pathMatch: 'full' },
  { path: 'list/:listId', component: TodoTaskComponent, pathMatch: 'full' },
  { path: 'multitodo/view', component: ViewtodoComponent, pathMatch: 'full' },
  { path: 'multitodo/create', component: CreatetodoComponent, pathMatch: 'full' },
  { path: 'multitodo/history/:id', component: HistorytodoComponent, pathMatch: 'full' },
  { path: 'forgotpassword', component: ForgetpasswordComponent, pathMatch: 'full' },
  { path: 'resetpassword', component: ResetpasswordComponent, pathMatch: 'full' },
  { path: "*", component: LoginpageComponent },
  { path: "**", component: LoginpageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
