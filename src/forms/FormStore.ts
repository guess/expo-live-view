import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import type { FormErrors, FormSpec, FormData } from './Form';
import type { FormFieldSpec } from './FormField';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';

export class FormStore<T extends FormData> {
  @observable form: FormSpec<T>;
  @observable isSubmitting: boolean = false;
  change: string;
  submit: string;
  changeSubject: Subject<{ path: string[]; value: any }> = new Subject();
  pushEvent: (event: string, data: T) => void;

  constructor(
    initialForm: FormSpec<T>,
    change: string,
    submit: string,
    pushEvent: (event: string, data: T) => void
  ) {
    this.form = initialForm;
    this.change = change;
    this.submit = submit;
    this.pushEvent = pushEvent;
    makeObservable(this);

    this.changeSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        map(({ path, value }) => ({ path, value }))
      )
      .subscribe(({ path, value }) => {
        console.log('Sending changes to server:', { path, value });
        // this.pushEvent(this.change, { path, value });
      });
  }

  @computed get isValid(): boolean {
    return Object.keys(this.form.errors).length === 0;
  }

  getField(path: string[]): FormFieldSpec {
    return {
      getValue: () => this.getValue(this.form.data, path),
      setValue: (value: any) => this.setValue(this.form.data, path, value),
      getErrors: () => this.getFormErrors(this.form.errors, path),
      validate: () => this.validateField(path),
    };
  }

  @action
  private setValue(obj: FormData, path: string[], value: any) {
    const lastKey = path[path.length - 1];
    const parentPath = path.slice(0, -1);
    const parent = parentPath.reduce((acc, key) => acc[key], obj);
    runInAction(() => {
      if (parent && lastKey) {
        parent[lastKey] = value;
        this.changeSubject.next({ path, value });
        this.validateField(path);
      }
    });
  }

  private getValue(obj: FormData, path: string[]): any {
    return path.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
  }

  @action
  private removeValue(obj: FormData, path: string[]) {
    const lastKey = path[path.length - 1];
    const parentPath = path.slice(0, -1);
    const parent = parentPath.reduce((acc, key) => acc[key], obj);
    if (parent && lastKey && parent.hasOwnProperty(lastKey)) {
      delete parent[lastKey];
    }
  }

  private getFormErrors(errors: FormErrors, path: string[]): string[] {
    const nestedErrors = this.getValue(errors, path);
    return Array.isArray(nestedErrors) ? nestedErrors : [];
  }

  @action
  private validateField(path: string[]) {
    const value = this.getValue(this.form.data, path);
    const rule = this.getValue(this.form.validationRules, path);
    const error = rule ? rule(value) : null;

    runInAction(() => {
      if (error) {
        this.setValue(this.form.errors, path, [error]);
      } else {
        this.removeValue(this.form.errors, path);
      }
    });
  }

  @action
  async submitForm() {
    if (this.isSubmitting || !this.isValid) return;

    runInAction(() => {
      this.isSubmitting = true;
    });

    try {
      this.pushEvent(this.submit, this.form.data);
      // You might want to clear the form or show a success message here
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  }
}
