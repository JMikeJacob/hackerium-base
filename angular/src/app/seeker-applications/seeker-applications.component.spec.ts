import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerApplicationsComponent } from './seeker-applications.component';

describe('SeekerApplicationsComponent', () => {
  let component: SeekerApplicationsComponent;
  let fixture: ComponentFixture<SeekerApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
