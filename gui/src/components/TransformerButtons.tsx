import React, { FC, ReactEventHandler, useContext, useRef, RefObject } from 'react';
import { transformations as tr } from '../components/types';
import { Grid, Button, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SnackbarContext } from '../alerts/SnackbarWrapper';

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
  index: number;
};

const TransformerButtons: FC<props> = ({ history, displayImage, transform, canUndo, canRedo, undo, redo, index }) => {
  const classes = useStyles();
  const { openSnackbar } = useContext(SnackbarContext) || {};

  const tooltips = {
    [tr.brighten]: 'Makes the image less dark',
    [tr.darken]: 'Makes the image less bright',
    [tr.saturate]: 'Makes the image more colorful',
    [tr.monochrome]: 'Makes the image black and white',
    [tr.sharpen]: 'Makes the image sharper'
  };

  const handleDownload = (e: React.MouseEvent): void => {
    if (index === 0) {
      e.preventDefault();
      openSnackbar!('Are you sure you want to download an unmodified image?', 'warning', displayImage, 20000);
    }
  };

  return (
    <Grid container justify='center' spacing={2}>
      <Grid item container justify='center' spacing={2}>
        {Object.values(tr).map((t: tr) => (
          <Grid item key={t}>
            {/* source: https://material-ui.com/components/tooltips/ */}
            <Tooltip title={tooltips[t]} placement="top">
              <Button variant='outlined' onClick={() => transform(t)}>{t}</Button>
            </Tooltip>
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
        <Button component='a' href={displayImage} disabled={!displayImage} variant="outlined" download onClick={(e: React.MouseEvent) => handleDownload(e)}>
          Download image
        </Button>
      </Grid>
    </Grid>
  );
};

export default TransformerButtons;