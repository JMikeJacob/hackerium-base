import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerJobBoardComponent } from './seeker-job-board.component';

describe('SeekerJobBoardComponent', () => {
  let component: SeekerJobBoardComponent;
  let fixture: ComponentFixture<SeekerJobBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerJobBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerJobBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
