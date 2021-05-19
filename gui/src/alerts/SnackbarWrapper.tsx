import React, { createContext, useState, FC, ReactChild } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

interface Props {
  children: ReactChild;
}
type ContextObj = {
  openSnackbar: (message: string, severity: string, duration?: number) => void;
  closeSnackbar: () => void;
};

const SnackbarContext = createContext<ContextObj | null>(null);

const SnackbarWrapper: FC<Props> = ({ children }) => {
  const defaultDuration = 6000;
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [duration, setDuration] = useState<number>(defaultDuration);

  // applies custom styling to the mui alert component
  interface AlertProps {
    onClose: () => any;
    severity: any;
  }
  const Alert: FC<AlertProps> = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  // opens snackbar with custom duration, severity, and message
  const handleOpen = (message: string, severity: string, duration: number = defaultDuration): void => {
    if (open)
      handleClose();
    if (!message || !severity)
      return;

    setSeverity(severity);
    setMessage(message);
    setDuration(duration);
    setOpen(true);
  };

  // closes snackbar
  const handleClose = (): void => {
    setOpen(false);
  };

  // provides functions to open and close the app to all this component's child props
  const contextValue: ContextObj = {
    openSnackbar: handleOpen,
    closeSnackbar: handleClose
  };

  return (
    <SnackbarContext.Provider value={contextValue} >
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        ClickAwayListenerProps={{ mouseEvent: 'onMouseUp' }}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider >
  );
};

export default SnackbarWrapper;
export { SnackbarContext };