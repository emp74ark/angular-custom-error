import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {CUSTOM_ERRORS} from '../constants/customTokens';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form-error-message',
  standalone: true,
  imports: [],
  templateUrl: './form-error-message.component.html',
  styleUrl: './form-error-message.component.css',
})
export class FormErrorMessageComponent implements ControlValueAccessor, OnInit {
  private readonly control = inject(NgControl, {self: true});
  private readonly errors = inject(CUSTOM_ERRORS);
  private destroyRef = inject(DestroyRef);

  protected readonly error = signal('');

  constructor() {
    this.control.valueAccessor = this;
  }

  ngOnInit(): void {
    this.control.control?.events.pipe(takeUntilDestroyed(this.destroyRef)).
      subscribe(() => {
        if (this.control.invalid) {
          const errorType = Object.keys(this.control.errors || {})?.[0];
          this.error.set(this.errors[errorType]);
        } else {
          this.error.set('');
        }
      });
  }

  writeValue(): void {
  }

  registerOnChange(): void {
  }

  registerOnTouched(): void {
  }

  setDisabledState?(): void {
  }

}
