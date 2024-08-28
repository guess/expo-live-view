import type { FormSpec, FormData, FormErrors } from './Form';
import type { FormFieldSpec } from './FormField';
import type { LiveViewModel } from '../phoenix/LiveViewModel';
import { get } from 'lodash';

export class FormStore<T extends FormData> {
  form: FormSpec<T>;
  viewModel: LiveViewModel;
  formKey: string;
  name: string;
  onChange: (data: T) => void;
  change: string;
  submit: string;

  constructor(
    form: FormSpec<T>,
    viewModel: LiveViewModel,
    formKey: string,
    name: string,
    onChange: (data: T) => void,
    change: string,
    submit: string
  ) {
    this.form = form;
    this.viewModel = viewModel;
    this.formKey = formKey;
    this.name = name;
    this.onChange = onChange;
    this.change = change;
    this.submit = submit;
  }

  getField(path: string[]): FormFieldSpec {
    return {
      getValue: () => this.getValue(path),
      setValue: (value: any) => this.setValue(path, value),
      getErrors: () => this.getErrors(path),
    };
  }

  setValue(path: string[], value: any) {
    const fullPath = [this.formKey, 'data', ...path];
    const newValue = this.viewModel.setValueFromPath(fullPath, value);
    newValue && this.onChange(newValue.data);
  }

  getValue(path: string[]): any {
    return get(this.form.data, path);
  }

  getErrors(path: string[]): string[] {
    return get(this.form.errors, path, []);
  }

  get errors(): FormErrors {
    return this.form.errors || {};
  }

  get isValid(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  validateForm(data: T) {
    this.pushEvent(this.change, data);
  }

  submitForm() {
    if (!this.isValid) return;
    this.pushEvent(this.submit, this.form.data);
  }

  private pushEvent(event: string, data: T) {
    this.viewModel.pushEvent(event, { [this.name]: data });
  }
}
