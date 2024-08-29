import React, { useContext } from 'react';
import type { FormFieldSpec } from './FormField';
import { FormStore } from './FormStore';
import { FormContext } from './Form';
import { View, StyleSheet } from 'react-native';

type InputsForProps = {
  for: FormFieldSpec;
  children: (form: FormStore<any>) => React.ReactNode;
};

export function InputsFor({ for: field, children }: InputsForProps) {
  const parentForm = useContext(FormContext);
  if (!parentForm) throw new Error('InputsFor must be used within a Form');

  const nestedForm = new FormStore(
    field.getForm(),
    parentForm.viewModel,
    parentForm.formKey,
    parentForm.name,
    (data) => field.setValue(data),
    parentForm.change,
    parentForm.submit
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
