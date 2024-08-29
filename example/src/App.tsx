import type { FormSpec } from 'expo-live-view';
import { LiveView, usePhoenixSocket } from 'expo-live-view';
import {
  Form,
  PhoenixSocketProvider,
  SubmitButton,
  TextFormField,
} from 'expo-live-view';
import { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LiveViewModel } from 'expo-live-view';
import { observer } from 'mobx-react-lite';
import { action, observable } from 'mobx';
import type { PhoenixRepo } from '../../src/phoenix/PhoenixRepo';

type UserForm = {
  name: string;
  address: {
    street: string;
    city: string;
  };
};

class UserFormViewModel extends LiveViewModel {
  form: FormSpec<UserForm> = {
    data: { name: '', address: { street: '', city: '' } },
    errors: {},
  };
  loading: boolean = false;
  isConnected: boolean = false;

  setLoading(isLoading: boolean) {
    this.loading = isLoading;
  }

  setName(name: string) {
    const { data } = this.form;
    data.name = name;
    this.form = { ...this.form, data: data };
  }

  setConnected(isConnected: boolean) {
    this.isConnected = isConnected;
  }

  constructor(phoenix: PhoenixRepo, topic: string) {
    super(phoenix, topic);

    this.makeObservable(this, {
      form: observable.deep,
      loading: observable,
      isConnected: observable,
      setLoading: action,
      setName: action,
      setConnected: action,
    });
  }
}

export default function App() {
  return (
    <PhoenixSocketProvider url="ws://localhost:4001/data">
      <ViewModelComponent />
    </PhoenixSocketProvider>
  );
}

const ViewModelComponent = observer(() => {
  const phoenix = usePhoenixSocket();
  const vm = useMemo(
    () => new UserFormViewModel(phoenix, '/users/new'),
    [phoenix]
  );

  const connected = vm.isConnected;

  return (
    <LiveView<UserFormViewModel> viewModel={vm}>
      <SafeAreaView style={styles.container}>
        <View style={styles.connected}>
          {connected ? (
            <Text>Connected to the socket</Text>
          ) : (
            <Text>Connecting...</Text>
          )}
        </View>
        <Form<UserForm> for={vm.form} change="validate" submit="save" as="user">
          {(form) => (
            <>
              <TextFormField
                field={form.getField('name')}
                label="Name"
                placeholder="Enter your name"
              />
              <View style={styles.nested}>
                <TextFormField
                  field={form.getField(['address', 'street'])}
                  label="Street"
                  placeholder="Enter your street"
                />
                <TextFormField
                  field={form.getField(['address', 'city'])}
                  label="City"
                  placeholder="Enter your city"
                />
              </View>
              <SubmitButton title="Create Account" />
            </>
          )}
        </Form>
      </SafeAreaView>
    </LiveView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    margin: 16,
  },
  connected: {
    paddingVertical: 16,
  },
  nested: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
});
