import { TestBed } from '@angular/core/testing';

import { EditCompanyService } from './edit-company.service';

describe('EditCompanyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditCompanyService = TestBed.get(EditCompanyService);
    expect(service).toBeTruthy();
  });
});
