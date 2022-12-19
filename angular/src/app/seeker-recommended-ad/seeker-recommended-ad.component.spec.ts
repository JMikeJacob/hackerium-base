import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerRecommendedAdComponent } from './seeker-recommended-ad.component';

describe('SeekerRecommendedAdComponent', () => {
  let component: SeekerRecommendedAdComponent;
  let fixture: ComponentFixture<SeekerRecommendedAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerRecommendedAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerRecommendedAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
