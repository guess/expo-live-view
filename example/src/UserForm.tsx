import {
  LiveView,
  useLiveView,
  useLiveViewModelFactory,
  liveObservable,
  liveViewModel,
  Form,
  SubmitButton,
  TextFormField,
  type FormSpec,
  LiveConnection,
  type LiveViewModel,
} from 'expo-live-view';

import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';

type UserForm = {
  name: string;
  address: {
    street: string;
    city: string;
  };
};

interface UserFormViewModel extends LiveViewModel {}

@liveViewModel('/users/new')
class UserFormViewModel {
  constructor(conn: LiveConnection) {
    console.log('conn', conn);
  }

  @liveObservable('is_connected')
  isConnected: boolean = false;

  @liveObservable.deep()
  form: FormSpec<UserForm> = {
    data: { name: '', address: { street: '', city: '' } },
    params: { name: '', address: { street: '', city: '' } },
    errors: {},
  };
}

export const UserFormLiveView = () => {
  const factory = useLiveViewModelFactory(
    (phx) => new UserFormViewModel(phx),
    []
  );

  return (
    <LiveView factory={factory}>
      <UserFormScreen />
    </LiveView>
  );
};

const UserFormScreen = observer(() => {
  const vm = useLiveView<UserFormViewModel>();
  const connected = vm.isConnected;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.connected}>
            {connected ? (
              <Text>Connected to the socket</Text>
            ) : (
              <Text>Connecting...</Text>
            )}
          </View>
          <Form<UserForm>
            for={vm.form}
            change="validate"
            submit="save"
            as="user"
          >
            {(form) => (
              <View>
                <TextFormField
                  field={form.getField('name')}
                  label="Name"
                  placeholder="Enter your name"
                />
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
                <SubmitButton title="Create Account" />
              </View>
            )}
          </Form>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  connected: {
    marginBottom: 16,
  },
});
