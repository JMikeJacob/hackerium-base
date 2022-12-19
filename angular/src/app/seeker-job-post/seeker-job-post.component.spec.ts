import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerJobPostComponent } from './seeker-job-post.component';

describe('SeekerJobPostComponent', () => {
  let component: SeekerJobPostComponent;
  let fixture: ComponentFixture<SeekerJobPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerJobPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerJobPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
