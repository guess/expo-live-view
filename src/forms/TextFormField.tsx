import { StyleSheet, TextInput } from 'react-native';
import { FormField, type FormFieldSpec } from './FormField';

type TextFormFieldProps = {
  field: FormFieldSpec;
  label?: string;
  placeholder?: string;
};

export function TextFormField({
  field,
  label,
  placeholder,
}: TextFormFieldProps) {
  return (
    <FormField field={field} label={label}>
      {(value, onChange, _errors) => (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
        />
      )}
    </FormField>
  );
}
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
});
