
import { ThemedView } from './ThemedView';
import { ReactNode } from 'react';

type ScreenContentWrapperProps = {
  children: ReactNode;
};

export function ScreenContentWrapper({ children }: ScreenContentWrapperProps) {
  return <ThemedView>{children}</ThemedView>;
}
