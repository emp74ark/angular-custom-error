# Angular custom form error message

Custom error message stored in the customErrorMessages:
```typescript
const customErrorMessages: Record<string, string> = {
  required: 'Required field',
  email: 'It is not a valid email',
  minlength: 'It is too short',
  maxlength: 'It is too long',
}
```

To get them in the component, create a custom injection token:
```typescript
const customErrorMessages: Record<string, string> = {
  required: 'Required field',
  email: 'It is not a valid email',
  minlength: 'It is too short',
  maxlength: 'It is too long',
}
```

Error message component implements ControlValueAccessor, injects NgForm and custom error messages from the CUSTOM_ERRORS. Injection the DestroyRef necessary for unsubscribing via pipe. Methods writeValue, registerOnChange, registerOnTouched and setDisabledState have to be implemented but don't contain any logic.

When an error occurs in Validator, it will be handled in this component.
```typescript
export class FormErrorMessageComponent implements ControlValueAccessor, OnInit {
  private readonly control = inject(NgControl, {self: true});
  private readonly errors = inject(CUSTOM_ERRORS);
  private destroyRef = inject(DestroyRef);

  protected readonly error = signal('')

  constructor() {
    this.control.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control.control?.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.control.invalid) {
        const errorType = Object.keys(this.control.errors || {})?.[0];
        this.error.set(this.errors[errorType])
      } else {
        this.error.set('')
      }
    })
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

}
```

Use custom error messages in the component:
```typescript
@Component({
  // all other entries
  providers: [
    {provide: CUSTOM_ERRORS, useValue: customErrorMessages},
  ],
})
export class SomeComponent implements OnInit {
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
}
```

Template:
```angular2html
<form [formGroup]="form">
  <div class="form-control">
    <label for="email">Email</label>
    <input formControlName="email" id="email" type="email" name="email">
    <app-form-error-message formControlName="email"></app-form-error-message>
  </div>

  <div class="form-control">
    <label for="length">Text</label>
    <input formControlName="length" id="length" type="text" name="length">
    <app-form-error-message formControlName="length"></app-form-error-message>
  </div>
</form>
```
