import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerViewResultsComponent } from './employer-view-results.component';

describe('EmployerViewResultsComponent', () => {
  let component: EmployerViewResultsComponent;
  let fixture: ComponentFixture<EmployerViewResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerViewResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerViewResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
