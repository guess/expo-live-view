import { onJoin } from 'expo-live-view';
import {
  LiveView,
  useLiveView,
  useLiveViewModelFactory,
  LiveConnection,
  liveEvent,
  liveObservable,
  liveViewModel,
  type LiveViewModel,
} from 'expo-live-view';
import { observer } from 'mobx-react-lite';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CounterViewModel extends LiveViewModel {}

@liveViewModel('count')
class CounterViewModel {
  constructor(conn: LiveConnection) {
    console.log('conn', conn);
  }

  @liveObservable()
  count = 0;

  @liveEvent('increment')
  increment() {
    return {};
  }

  @liveEvent('decrement')
  decrement() {
    return {};
  }

  @onJoin()
  onJoin() {
    console.log('onJoin', this);
  }
}

export const CounterLiveView = () => {
  const factory = useLiveViewModelFactory(
    (phx) => new CounterViewModel(phx),
    []
  );

  return (
    <LiveView factory={factory}>
      <CounterScreen />
    </LiveView>
  );
};

const CounterScreen = observer(() => {
  const vm = useLiveView<CounterViewModel>();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.countText}>{vm.count}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => vm.decrement()} style={styles.button}>
          <Text style={styles.buttonText}>Decrement</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => vm.increment()} style={styles.button}>
          <Text style={styles.buttonText}>Increment</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  countText: {
    color: 'black',
    fontSize: 56,
    alignSelf: 'center',
    marginBottom: 48,
  },
});
