import { createContext, type ReactNode } from 'react';
import { FormStore } from './FormStore';
import { View } from 'react-native';
import { useLocalObservable } from 'mobx-react-lite';
import { useLiveView } from 'expo-live-view/phoenix/LiveView';

export type FormData = { [key: string]: any };
export type FormErrors = { [key: string]: string[] | FormErrors };
export type ValidationRule = (value: any) => string | null;

export type FormSpec<T extends FormData> = {
  data: T;
  errors: FormErrors;
  validationRules: Partial<Record<keyof T, ValidationRule>>;
};

// Context
export const FormContext = createContext<FormStore<any> | null>(null);

// Form component
type FormProps<T extends FormData> = {
  for: FormSpec<T>;
  change: string;
  submit: string;
  children: (form: FormStore<T>) => ReactNode;
};

export function Form<T extends FormData>({
  for: form,
  change,
  submit,
  children,
}: FormProps<T>) {
  const { pushEvent } = useLiveView();
  const formStore = useLocalObservable(
    () => new FormStore(form, change, submit, pushEvent)
  );

  return (
    <FormContext.Provider value={formStore}>
      <View>{children(formStore)}</View>
    </FormContext.Provider>
  );
}
