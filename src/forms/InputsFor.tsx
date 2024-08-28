import { useContext, type ReactNode } from 'react';
import type { FormFieldSpec } from './FormField';
import { FormStore } from './FormStore';
import { FormContext } from './Form';
import { useLocalObservable } from 'mobx-react-lite';
import { StyleSheet, View } from 'react-native';

type InputsForProps = {
  for: FormFieldSpec;
  children: (form: FormStore<any>) => ReactNode;
};

export function InputsFor({ for: fieldRef, children }: InputsForProps) {
  const parentForm = useContext(FormContext);
  if (!parentForm) throw new Error('InputsFor must be used within a Form');

  const nestedForm = useLocalObservable(
    () =>
      new FormStore(
        { data: fieldRef.getValue(), errors: {}, validationRules: {} },
        parentForm.change,
        parentForm.submit,
        (data) => {
          fieldRef.setValue(data);
          return Promise.resolve();
        }
      )
  );

  return (
    <FormContext.Provider value={nestedForm}>
      <View style={styles.container}>{children(nestedForm)}</View>
    </FormContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
});
