import type { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

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
    errors: string[] | undefined
  ) => ReactNode;
  renderLabel?: (label: string) => ReactNode;
  renderError?: (error: string, index: number) => ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
};

export const FormField = observer(
  ({
    field,
    label,
    children,
    renderLabel,
    renderError,
    containerStyle,
    labelStyle,
    errorStyle,
  }: FormFieldProps) => {
    const labelRenderer =
      renderLabel ||
      ((formLabel: string) => (
        <FormFieldLabel style={labelStyle}>{formLabel}</FormFieldLabel>
      ));

    const errorRenderer =
      renderError ||
      ((formError: string, index: number) => (
        <FormFieldError key={index} style={errorStyle}>
          {formError}
        </FormFieldError>
      ));

    return (
      <View style={[styles.fieldContainer, containerStyle]}>
        {label && labelRenderer(label)}
        {children(field.getValue(), field.setValue, field.getErrors())}
        {field.getErrors()?.map((error, index) => errorRenderer(error, index))}
      </View>
    );
  }
);

const FormFieldLabel = ({
  style,
  children,
}: {
  style?: TextStyle;
  children: ReactNode;
}) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

const FormFieldError = ({
  style,
  children,
}: {
  style?: TextStyle;
  children: ReactNode;
}) => {
  return <Text style={[styles.error, style]}>{children}</Text>;
};

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
