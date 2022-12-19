import { TestBed } from '@angular/core/testing';

import { SeekerService } from './seeker.service';

describe('SeekerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeekerService = TestBed.get(SeekerService);
    expect(service).toBeTruthy();
  });
});
