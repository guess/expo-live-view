import { PhoenixSocketProvider } from 'expo-live-view';
import { UserFormLiveView } from './UserForm';
import { CounterLiveView } from './Counter';

const url = 'ws://localhost:4000/lvm';
const type = 'counter';

const App = () => {
  let component;
  if (type === 'counter') {
    component = <CounterLiveView />;
  } else {
    component = <UserFormLiveView />;
  }

  return <PhoenixSocketProvider url={url}>{component}</PhoenixSocketProvider>;
};

export default App;
