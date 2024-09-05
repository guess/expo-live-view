import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type { LiveViewModel, PhoenixRepo } from 'live-view-model';
import { usePhoenixSocket } from './PhoenixSocketProvider';

export const LiveViewContext = createContext<LiveViewModel | null>(null);

// LiveView component
type LiveViewProps = {
  factory: (phoenix: PhoenixRepo) => LiveViewModel;
  children: ReactNode;
};

export function LiveView({ factory, children }: LiveViewProps) {
  const phoenix = usePhoenixSocket();
  const viewModel = useMemo(() => factory(phoenix), [phoenix, factory]);

  useEffect(() => {
    viewModel.join();
    return () => viewModel.leave();
  }, [viewModel]);

  return (
    <LiveViewContext.Provider value={viewModel}>
      {children}
    </LiveViewContext.Provider>
  );
}

export const useLiveView = <T extends LiveViewModel>(): T => {
  const context = useContext(LiveViewContext);
  if (context === null) {
    throw new Error('useLiveView must be used within a LiveView');
  }
  return context as T;
};
