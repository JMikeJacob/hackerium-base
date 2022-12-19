import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerTestComponent } from './seeker-test.component';

describe('SeekerTestComponent', () => {
  let component: SeekerTestComponent;
  let fixture: ComponentFixture<SeekerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
