import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewBarComponent } from './interview-bar.component';

describe('InterviewBarComponent', () => {
  let component: InterviewBarComponent;
  let fixture: ComponentFixture<InterviewBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
