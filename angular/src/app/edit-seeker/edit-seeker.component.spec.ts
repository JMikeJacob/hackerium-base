import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSeekerComponent } from './edit-seeker.component';

describe('EditSeekerComponent', () => {
  let component: EditSeekerComponent;
  let fixture: ComponentFixture<EditSeekerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSeekerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSeekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
