import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorytodoComponent } from './historytodo.component';

describe('HistorytodoComponent', () => {
  let component: HistorytodoComponent;
  let fixture: ComponentFixture<HistorytodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorytodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorytodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
