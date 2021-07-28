import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadExcelModalComponent } from './upload-excel-modal.component';

describe('UploadExcelModalComponent', () => {
  let component: UploadExcelModalComponent;
  let fixture: ComponentFixture<UploadExcelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadExcelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadExcelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
