import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerRecommendedComponent } from './seeker-recommended.component';

describe('SeekerRecommendedComponent', () => {
  let component: SeekerRecommendedComponent;
  let fixture: ComponentFixture<SeekerRecommendedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerRecommendedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerRecommendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
