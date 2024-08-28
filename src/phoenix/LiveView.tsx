import { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { LiveViewModel } from './LiveViewModel';

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

export const useLiveView = () => {
  const context = useContext(LiveViewContext);
  if (context === null) {
    throw new Error('useLiveView must be used within a LiveView');
  }
  return context;
};
