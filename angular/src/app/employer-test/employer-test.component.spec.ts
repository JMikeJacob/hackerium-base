import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerTestComponent } from './employer-test.component';

describe('EmployerTestComponent', () => {
  let component: EmployerTestComponent;
  let fixture: ComponentFixture<EmployerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
