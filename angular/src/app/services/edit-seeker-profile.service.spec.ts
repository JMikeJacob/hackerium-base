import { TestBed } from '@angular/core/testing';

import { EditSeekerProfileService } from './edit-seeker-profile.service';

describe('EditSeekerProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditSeekerProfileService = TestBed.get(EditSeekerProfileService);
    expect(service).toBeTruthy();
  });
});
