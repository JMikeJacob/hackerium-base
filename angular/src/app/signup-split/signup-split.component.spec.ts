import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupSplitComponent } from './signup-split.component';

describe('SignupSplitComponent', () => {
  let component: SignupSplitComponent;
  let fixture: ComponentFixture<SignupSplitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupSplitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
