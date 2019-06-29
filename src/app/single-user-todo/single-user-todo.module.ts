import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoTaskComponent } from './todo-task/todo-task.component';
import { TodoSubtaskComponent } from './todo-subtask/todo-subtask.component';
import { LayoutModule } from '../layout/layout.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [TodoListComponent, TodoTaskComponent, TodoSubtaskComponent],
  imports: [
    CommonModule, LayoutModule, FormsModule, RouterModule
  ]
})
export class SingleUserTodoModule { }
