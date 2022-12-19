import { TestBed } from '@angular/core/testing';

import { EditServiceService } from './edit-service.service';

describe('EditServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditServiceService = TestBed.get(EditServiceService);
    expect(service).toBeTruthy();
  });
});
