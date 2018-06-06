import { TestBed, inject } from '@angular/core/testing';

import { GetreviewsserviceService } from './getreviewsservice.service';

describe('GetreviewsserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetreviewsserviceService]
    });
  });

  it('should be created', inject([GetreviewsserviceService], (service: GetreviewsserviceService) => {
    expect(service).toBeTruthy();
  }));
});
