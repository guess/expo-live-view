import { StyleSheet, TextInput } from 'react-native';
import { FormField, type FormFieldSpec } from './FormField';

type TextFormFieldProps = {
  field: FormFieldSpec;
  label?: string;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
};

export function TextFormField({
  field,
  label,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
}: TextFormFieldProps) {
  return (
    <FormField field={field} label={label}>
      {(value, onChange, _errors) => (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onBlur={() => field.validate()}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
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
