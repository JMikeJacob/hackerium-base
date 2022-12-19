import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAdComponent } from './test-ad.component';

describe('TestAdComponent', () => {
  let component: TestAdComponent;
  let fixture: ComponentFixture<TestAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
