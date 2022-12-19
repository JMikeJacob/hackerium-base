import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerEditProfileComponent } from './employer-edit-profile.component';

describe('EmployerEditProfileComponent', () => {
  let component: EmployerEditProfileComponent;
  let fixture: ComponentFixture<EmployerEditProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerEditProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
