import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessGroupPreviewComponent } from './access-group-preview.component';

describe('AccessGroupPreviewComponent', () => {
  let component: AccessGroupPreviewComponent;
  let fixture: ComponentFixture<AccessGroupPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessGroupPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessGroupPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
