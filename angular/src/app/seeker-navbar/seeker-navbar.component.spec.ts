import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerNavbarComponent } from './seeker-navbar.component';

describe('SeekerNavbarComponent', () => {
  let component: SeekerNavbarComponent;
  let fixture: ComponentFixture<SeekerNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
