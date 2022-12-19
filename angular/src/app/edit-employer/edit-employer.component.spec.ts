import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployerComponent } from './edit-employer.component';

describe('EditEmployerComponent', () => {
  let component: EditEmployerComponent;
  let fixture: ComponentFixture<EditEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
