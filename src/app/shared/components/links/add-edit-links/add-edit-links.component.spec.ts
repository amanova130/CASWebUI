import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLinksComponent } from './add-edit-links.component';

describe('AddEditLinksComponent', () => {
  let component: AddEditLinksComponent;
  let fixture: ComponentFixture<AddEditLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
