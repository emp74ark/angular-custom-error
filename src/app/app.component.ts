import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {CUSTOM_ERRORS} from './constants/customTokens';
import {customErrorMessages} from './constants/customErrorMessages';
import {
  FormErrorMessageComponent,
} from './form-error-message/form-error-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormErrorMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    {provide: CUSTOM_ERRORS, useValue: customErrorMessages},
  ],
})
export class AppComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
  ) {
  }

  form: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      length: ['', [Validators.minLength(3), Validators.maxLength(10)]],
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
