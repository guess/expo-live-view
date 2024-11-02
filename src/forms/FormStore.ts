import type { LiveViewModel } from 'live-view-model';
import type { FormSpec, FormData, FormErrors } from './Form';
import type { FormFieldSpec } from './FormField';
import { get } from 'lodash';

export class FormStore<T extends FormData> {
  form: FormSpec<T>;
  viewModel: LiveViewModel;
  formKey: string;
  name: string;
  onChange: (params: T) => void;
  change: string;
  submit: string;

  constructor(
    form: FormSpec<T>,
    viewModel: LiveViewModel,
    formKey: string,
    name: string,
    onChange: (params: T) => void,
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

  getField(pathOrName: string[] | string): FormFieldSpec {
    const path = toPath(pathOrName);
    const name = lastElement(path)!;

    return {
      name,
      getValue: () => this.getValue(path),
      setValue: (value: any) => this.setValue(path, value),
      getErrors: () => this.getErrors(path),
    };
  }

  setValue(path: string[], value: any) {
    const fullPath = [this.formKey, 'params', ...path];
    const newValue = this.viewModel.setValueFromPath(fullPath, value);
    newValue && this.onChange(newValue.params);
  }

  getValue(path: string[]): any {
    return get(this.params, path);
  }

  getErrors(path: string[]): string[] {
    const fieldErrors = get(this.errors, path, []);
    return Array.isArray(fieldErrors) ? fieldErrors : [];
  }

  get data(): T {
    return this.form.data;
  }

  get params(): T {
    return this.form.params;
  }

  get errors(): FormErrors {
    return this.form.errors || {};
  }

  get isValid(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  validateForm(params: T) {
    this.pushEvent(this.change, params);
  }

  submitForm() {
    if (!this.isValid) return;
    this.pushEvent(this.submit, this.params);
  }

  private pushEvent(event: string, params: T) {
    this.viewModel.pushEvent(event, { [this.name]: params });
  }
}

const toPath = (pathOrName: string[] | string): string[] => {
  return typeof pathOrName === 'string' ? [pathOrName] : pathOrName;
};

const lastElement = (path: string[]) => path[path.length - 1];
