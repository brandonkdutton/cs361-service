import React, { ReactChild, FC } from 'react';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/styles/makeStyles';

interface props {
  children: ReactChild;
}

const DarkModeWrapper: FC<props> = ({ children }) => {
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
    }
  });
  const useStyles = makeStyles({
    backPaperStyle: {
      minHeight: '100%',
      minWidth: '100%',
      position: 'absolute',
      backgroundColor: theme.palette.background.default,
    },
  });

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Paper square className={classes.backPaperStyle}>
        {children}
      </Paper>
    </ThemeProvider>
  );
};
export default DarkModeWrapper;