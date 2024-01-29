import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetStandardTagComponent } from './asset-standard-tag.component';

describe('AssetStandardTagComponent', () => {
  let component: AssetStandardTagComponent;
  let fixture: ComponentFixture<AssetStandardTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetStandardTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetStandardTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
