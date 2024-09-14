import { PhoenixSocketProvider } from 'expo-live-view';
import { UserFormLiveView } from './UserForm';
import { CounterLiveView } from './Counter';
import { View } from 'react-native';

enum AppType {
  counter = 'counter',
  userForm = 'user',
}

const URL = 'ws://localhost:4000/lvm';
const TYPE_TO_RUN: AppType = AppType.userForm;

const App = () => {
  const component = componentFromAppType(TYPE_TO_RUN);

  return <PhoenixSocketProvider url={URL}>{component}</PhoenixSocketProvider>;
};

const componentFromAppType = (type: AppType) => {
  switch (type) {
    case AppType.counter:
      return <CounterLiveView />;
    case AppType.userForm:
      return <UserFormLiveView />;
    default:
      return <View />;
  }
};

export default App;
