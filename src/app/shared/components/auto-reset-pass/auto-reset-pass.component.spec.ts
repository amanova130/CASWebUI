import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoResetPassComponent } from './auto-reset-pass.component';

describe('AutoResetPassComponent', () => {
  let component: AutoResetPassComponent;
  let fixture: ComponentFixture<AutoResetPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoResetPassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoResetPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
