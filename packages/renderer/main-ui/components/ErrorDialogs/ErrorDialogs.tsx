import * as React from 'react';

// Components
import { DialogBox } from '../Elements/DialogBox';

export const ErrorDialogs = () => {
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    window.onerror = (_event, _source, _, __, error) => {
      setError(error);
      setIsDialogOpen(true);
    };

    process.on('uncaughtException', () => console.log('Exception'));
  }, []);

  return (
    <>
      {isDialogOpen && (
        <DialogBox title="Error" isOpen={isDialogOpen} type="error" closeSetter={setIsDialogOpen}>
          <div>
            <span>{error?.message}</span>
            <span>Cause: {error?.cause?.toString() || 'Unknown'}</span>
          </div>
        </DialogBox>
      )}
    </>
  );
};
