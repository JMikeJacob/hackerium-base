import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobPostComponent } from './edit-job-post.component';

describe('EditJobPostComponent', () => {
  let component: EditJobPostComponent;
  let fixture: ComponentFixture<EditJobPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJobPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJobPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
