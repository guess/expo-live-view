import type { FormSpec } from 'expo-live-view';
import { LiveView, usePhoenixSocket } from 'expo-live-view';
import {
  Form,
  PhoenixSocketProvider,
  SubmitButton,
  TextFormField,
} from 'expo-live-view';
import { LiveViewModel } from 'expo-live-view/phoenix/LiveViewModel';
import { useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

type UserForm = {
  name: string;
};

const initialForm: FormSpec<UserForm> = {
  data: {
    name: '',
  },
  errors: {},
  validationRules: {
    name: (value: string) => (value.length > 0 ? null : 'Name is required'),
  },
};

// const pushEvent = (event: string, payload: any) => {
//   console.log('Pushing event: ' + event, payload);
// };

class UserFormViewModel extends LiveViewModel {
  form = initialForm;
}

export default function App() {
  return (
    <PhoenixSocketProvider url="ws://localhost:4001/data">
      <UserFormLive />
    </PhoenixSocketProvider>
  );
}

const UserFormLive = () => {
  const phoenix = usePhoenixSocket();
  const vm = useMemo(
    () => new UserFormViewModel(phoenix, 'user:form'),
    [phoenix]
  );

  return (
    <LiveView<UserFormViewModel> viewModel={vm}>
      <SafeAreaView style={styles.container}>
        <Form<UserForm> for={vm.form} change="validate" submit="save">
          {(form) => (
            <>
              <TextFormField
                field={form.getField(['name'])}
                label="Name"
                placeholder="Enter your name"
              />
              <SubmitButton title="Create Account" />
            </>
          )}
        </Form>
      </SafeAreaView>
    </LiveView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
});
