import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFacultyComponent } from './add-edit-faculty.component';

describe('AddEditFacultyComponent', () => {
  let component: AddEditFacultyComponent;
  let fixture: ComponentFixture<AddEditFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFacultyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
