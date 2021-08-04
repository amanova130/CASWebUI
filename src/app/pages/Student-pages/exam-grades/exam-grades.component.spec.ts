import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamGradesComponent } from './exam-grades.component';

describe('ExamGradesComponent', () => {
  let component: ExamGradesComponent;
  let fixture: ComponentFixture<ExamGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamGradesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
