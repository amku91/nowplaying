import { TestBed, inject } from '@angular/core/testing';

import { TwitterapiService } from './twitterapi.service';

describe('TwitterapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TwitterapiService]
    });
  });

  it('should be created', inject([TwitterapiService], (service: TwitterapiService) => {
    expect(service).toBeTruthy();
  }));
});
