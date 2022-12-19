import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerProfileComponent } from './seeker-profile.component';

describe('SeekerProfileComponent', () => {
  let component: SeekerProfileComponent;
  let fixture: ComponentFixture<SeekerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
