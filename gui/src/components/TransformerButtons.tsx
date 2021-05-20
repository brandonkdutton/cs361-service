import React, { FC } from 'react';
import { transformations as tr } from '../components/types';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    padding: theme.spacing(2)
  },
  exampleImage: {
    maxHeight: '300px'
  },
}));

interface props {
  history: any;
  displayImage: string;
  transform: (tran: tr) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
};

const TransformerButtons: FC<props> = ({ history, displayImage, transform, canUndo, canRedo, undo, redo }) => {
  const classes = useStyles();

  return (
    <Grid container justify='center' spacing={2}>
      <Grid item container justify='center' spacing={2}>
        {Object.values(tr).map((t: tr) => (
          <Grid item key={t}>
            <Button variant='outlined' onClick={() => transform(t)}>{t}</Button>
          </Grid>
        ))}
      </Grid>
      <Grid item container justify='center' spacing={2}>
        <Grid item>
          <Button
            variant='outlined'
            disabled={!canUndo}
            onClick={undo}
          >Undo</Button>
        </Grid>
        <Grid item>
          <Button
            variant='outlined'
            disabled={!canRedo}
            onClick={redo}
          >Redo</Button>
        </Grid>
      </Grid>
      <Grid item>
        <Button component='a' href={displayImage} disabled={!displayImage} variant="outlined" download>
          Download image
        </Button>
      </Grid>
    </Grid>
  );
};

export default TransformerButtons;