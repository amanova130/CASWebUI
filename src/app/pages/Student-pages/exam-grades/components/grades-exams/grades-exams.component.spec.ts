import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesExamsComponent } from './grades-exams.component';

describe('GradesExamsComponent', () => {
  let component: GradesExamsComponent;
  let fixture: ComponentFixture<GradesExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradesExamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradesExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
