import { createContext, useContext, type ReactNode } from 'react';
import type { LiveViewModel } from './LiveViewModel';
import { View } from 'react-native';

export const LiveViewContext = createContext<LiveViewModel | null>(null);

// LiveView component
type LiveViewProps<T extends LiveViewModel> = {
  viewModel: T;
  children: ReactNode;
};

export function LiveView<T extends LiveViewModel>({
  viewModel,
  children,
}: LiveViewProps<T>) {
  return (
    <LiveViewContext.Provider value={viewModel}>
      <View>{children}</View>
    </LiveViewContext.Provider>
  );
}

export const useLiveView = () => {
  const context = useContext(LiveViewContext);
  if (context === null) {
    throw new Error('useLiveView must be used within a LiveView');
  }
  return context;
};
