import { TestBed } from '@angular/core/testing';

import { MultitodoService } from './multitodo.service';

describe('MultitodoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MultitodoService = TestBed.get(MultitodoService);
    expect(service).toBeTruthy();
  });
});
