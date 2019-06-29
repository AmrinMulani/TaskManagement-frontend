import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSubtaskComponent } from './todo-subtask.component';

describe('TodoSubtaskComponent', () => {
  let component: TodoSubtaskComponent;
  let fixture: ComponentFixture<TodoSubtaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoSubtaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoSubtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
