import { TestBed } from '@angular/core/testing';

import { AssetStandardTagService } from './asset-standard-tag.service';

describe('AssetStandardTagService', () => {
  let service: AssetStandardTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetStandardTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
