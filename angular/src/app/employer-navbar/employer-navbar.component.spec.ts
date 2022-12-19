import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerNavbarComponent } from './employer-navbar.component';

describe('EmployerNavbarComponent', () => {
  let component: EmployerNavbarComponent;
  let fixture: ComponentFixture<EmployerNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
