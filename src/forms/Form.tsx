import { createContext, useEffect, useMemo, type ReactNode } from 'react';
import { FormStore } from './FormStore';
import { View } from 'react-native';
import { useLiveView } from '../phoenix/LiveView';
import { BehaviorSubject, debounceTime } from 'rxjs';

export type FormData = { [key: string]: any };
export type FormErrors = { [key: string]: string[] | FormErrors };
export type ValidationRule = (value: any) => string | null;

export type FormSpec<T extends FormData> = {
  data: T;
  errors?: FormErrors;
};

// Context
export const FormContext = createContext<FormStore<any> | null>(null);

// Form component
type FormProps<T extends FormData> = {
  for: FormSpec<T>;
  as: string;
  change: string;
  submit: string;
  debounce?: number;
  children: (form: FormStore<T>) => ReactNode;
};

export function Form<T extends FormData>({
  for: form,
  as,
  change,
  submit,
  debounce = 200,
  children,
}: FormProps<T>) {
  const vm = useLiveView();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const subject = useMemo(() => new BehaviorSubject<T>(form.data), []);
  const onChange = useMemo(() => {
    console.log('new onchange');
    return (data: T) => {
      console.log('onchange called', data);
      subject.next(data);
    };
  }, [subject]);

  const formKey = useMemo(() => {
    for (const key of Object.keys(vm)) {
      if ((vm as any)[key] === form) {
        return key;
      }
    }
    throw new Error('Form not found in view model');
  }, [vm, form]);

  const formStore = useMemo(
    () => new FormStore(form, vm, formKey, as, onChange, change, submit),
    [form, vm, formKey, as, onChange, change, submit]
  );

  useEffect(() => {
    const subscription = subject
      .pipe(debounceTime(debounce))
      .subscribe((data) => {
        vm.pushEvent(change, { [as]: data });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [subject, debounce, vm, as, change]);

  return (
    <FormContext.Provider value={formStore}>
      <View>{children(formStore)}</View>
    </FormContext.Provider>
  );
}
