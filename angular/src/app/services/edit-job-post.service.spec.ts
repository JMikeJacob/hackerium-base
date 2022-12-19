import { TestBed } from '@angular/core/testing';

import { EditJobPostService } from './edit-job-post.service';

describe('EditJobPostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditJobPostService = TestBed.get(EditJobPostService);
    expect(service).toBeTruthy();
  });
});
