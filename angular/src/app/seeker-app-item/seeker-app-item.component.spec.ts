import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerAppItemComponent } from './seeker-app-item.component';

describe('SeekerAppItemComponent', () => {
  let component: SeekerAppItemComponent;
  let fixture: ComponentFixture<SeekerAppItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerAppItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerAppItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
