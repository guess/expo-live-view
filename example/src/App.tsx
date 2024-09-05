import type { FormSpec } from 'expo-live-view';
import { LiveView, useLiveView } from 'expo-live-view';
import {
  Form,
  PhoenixSocketProvider,
  SubmitButton,
  TextFormField,
} from 'expo-live-view';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import { LiveViewModel, type PhoenixConnection } from 'live-view-model';

type UserForm = {
  name: string;
  address: {
    street: string;
    city: string;
  };
};

class UserFormViewModel extends LiveViewModel {
  isConnected: boolean = false;
  form: FormSpec<UserForm> = {
    data: { name: '', address: { street: '', city: '' } },
    errors: {},
  };

  constructor(phoenix: PhoenixConnection, topic: string) {
    super(phoenix, topic);

    this.makeObservable(this, {
      form: observable.deep,
      isConnected: observable,
    });
  }
}

export default function App() {
  return (
    <PhoenixSocketProvider url="ws://localhost:4001/data">
      <UserFormLiveView />
    </PhoenixSocketProvider>
  );
}

const UserFormLiveView = () => {
  return (
    <LiveView factory={(phx) => new UserFormViewModel(phx, '/users/new')}>
      <UserFormScreen />
    </LiveView>
  );
};

const UserFormScreen = observer(() => {
  const vm = useLiveView<UserFormViewModel>();

  const connected = vm.isConnected;

  return (
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
