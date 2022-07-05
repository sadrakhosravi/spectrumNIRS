// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as React from 'react';

// Components
import { Dialog } from '../Elements/Dialog';

type DialogType = {
  open: boolean;
  children: React.ReactNode;
  closeSetter: (value: boolean) => void;
};

export function withDialog<P>(WrappedComponent: React.ComponentType<P>) {
  const ComponentWithDialog = ({
    open,
    closeSetter,
    children,
    ...rest
  }: P & DialogType) => (
    <Dialog open={open} closeSetter={closeSetter}>
      <WrappedComponent {...rest}>{children} </WrappedComponent>;
    </Dialog>
  );

  // Return the new component
  return ComponentWithDialog;
}
