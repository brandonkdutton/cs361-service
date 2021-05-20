import React, { FC } from 'react';
import { imageSource, transformations as tr } from '../components/types';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

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
  transform: (tan: tr) => void;
};

const TransformerButtons: FC<props> = ({ history, displayImage, transform }) => {
  const classes = useStyles();

  return (
    <Grid container justify='center' spacing={2}>
      <Grid item container justify='center' spacing={2}>
        {Object.values(tr).map((t: tr) => (
          <Grid item key={t}>
            <Button variant='outlined'>{t}</Button>
          </Grid>
        ))}
      </Grid>
      <Grid item container justify='center' spacing={2}>
        <Grid item>
          <Button variant='outlined'>Undo</Button>
        </Grid>
        <Grid item>
          <Button variant='outlined'>Redo</Button>
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