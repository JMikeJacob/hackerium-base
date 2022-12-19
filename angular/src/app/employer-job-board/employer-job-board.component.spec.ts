import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerJobBoardComponent } from './employer-job-board.component';

describe('EmployerJobBoardComponent', () => {
  let component: EmployerJobBoardComponent;
  let fixture: ComponentFixture<EmployerJobBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerJobBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerJobBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
