import React, { createContext, useState, FC, ReactChild, MutableRefObject } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

interface Props {
  children: ReactChild;
}
type ContextObj = {
  openSnackbar: (message: string, severity: string, fileUrl: string, duration?: number) => void;
  closeSnackbar: () => void;
};

const SnackbarContext = createContext<ContextObj | null>(null);

const SnackbarWrapper: FC<Props> = ({ children }) => {
  const defaultDuration = 6000;
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [duration, setDuration] = useState<number>(defaultDuration);
  const [yesFile, setYesFile] = useState<string>();

  // applies custom styling to the mui alert component
  interface AlertProps {
    onClose: () => any;
    severity: any;
  }
  const Alert: FC<AlertProps> = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  // opens snackbar with custom duration, severity, and message
  const handleOpen = (message: string, severity: string, fileUrl: string, duration: number = defaultDuration): void => {
    if (open)
      handleClose();
    if (!message || !severity)
      return;

    setYesFile(fileUrl);
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
        action="yes"
      >
        {/* source: https://material-ui.com/components/snackbars/ */}
        <Alert onClose={handleClose} severity={severity}>
          <Grid container direction='column' alignItems='center' spacing={1}>
            <Grid item>{message}</Grid>
          </Grid>
          <Grid item container justify='center' spacing={1}>
            <Grid item>
              <Button variant="outlined" href={yesFile} onClick={handleClose} download component='a'>Yes</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={handleClose}>No</Button>
            </Grid>
          </Grid>
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider >
  );
};

export default SnackbarWrapper;
export { SnackbarContext };