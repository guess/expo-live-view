import type { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet, Text, View } from 'react-native';

export type FormFieldSpec = {
  getValue: () => any;
  setValue: (value: any) => void;
  getErrors: () => string[];
};

type FormFieldProps = {
  field: FormFieldSpec;
  label?: string;
  children: (
    value: any,
    onChange: (value: any) => void,
    errors: string[]
  ) => ReactNode;
};

export const FormField = observer(
  ({ field, label, children }: FormFieldProps) => {
    return (
      <View style={styles.fieldContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        {children(field.getValue(), field.setValue, field.getErrors())}
        {field.getErrors().map((error, index) => (
          <Text key={index} style={styles.error}>
            {error}
          </Text>
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});
