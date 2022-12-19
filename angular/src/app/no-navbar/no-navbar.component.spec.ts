import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoNavbarComponent } from './no-navbar.component';

describe('NoNavbarComponent', () => {
  let component: NoNavbarComponent;
  let fixture: ComponentFixture<NoNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
