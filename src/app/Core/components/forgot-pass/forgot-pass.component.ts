import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {
  public forgetForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  public ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email: [null, [Validators.required]],
    });
  }

  public onForget(): void {
    this.markAsDirty(this.forgetForm);
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    // tslint:disable-next-line:forin
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }
}
