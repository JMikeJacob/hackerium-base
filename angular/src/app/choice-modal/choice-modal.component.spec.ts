import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceModalComponent } from './choice-modal.component';

describe('ChoiceModalComponent', () => {
  let component: ChoiceModalComponent;
  let fixture: ComponentFixture<ChoiceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoiceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
