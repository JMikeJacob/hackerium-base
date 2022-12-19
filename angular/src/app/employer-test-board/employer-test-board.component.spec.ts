import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerTestBoardComponent } from './employer-test-board.component';

describe('EmployerTestBoardComponent', () => {
  let component: EmployerTestBoardComponent;
  let fixture: ComponentFixture<EmployerTestBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerTestBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerTestBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
