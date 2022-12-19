import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerAppItemComponent } from './employer-app-item.component';

describe('EmployerAppItemComponent', () => {
  let component: EmployerAppItemComponent;
  let fixture: ComponentFixture<EmployerAppItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerAppItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerAppItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
