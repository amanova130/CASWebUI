import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamViewTabComponent } from './exam-view-tab.component';

describe('ExamViewTabComponent', () => {
  let component: ExamViewTabComponent;
  let fixture: ComponentFixture<ExamViewTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamViewTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamViewTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
