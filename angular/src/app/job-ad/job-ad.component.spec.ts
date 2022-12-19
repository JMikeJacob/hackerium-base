import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdComponent } from './job-ad.component';

describe('JobAdComponent', () => {
  let component: JobAdComponent;
  let fixture: ComponentFixture<JobAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
