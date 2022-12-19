import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitTestPageComponent } from './submit-test-page.component';

describe('SubmitTestPageComponent', () => {
  let component: SubmitTestPageComponent;
  let fixture: ComponentFixture<SubmitTestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitTestPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitTestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
