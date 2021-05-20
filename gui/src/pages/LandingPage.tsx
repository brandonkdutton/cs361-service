import React, { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { transformations as tr } from '../components/types';
import SelectImageSource from '../components/SelectImageSource';
import { imageSource } from '../components/types';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    padding: theme.spacing(2)
  },
  exampleImage: {
    maxWidth: '300px',
    minWidth: '300px',
  },
  layoutContainer: {
    padding: theme.spacing(2),
    flexWrap: 'nowrap'
  }
}));

interface props {
  history: any;
  setFile: (file: File | null) => void,
  setUrl: (url: string) => void,
  setImgSrcType: (src: imageSource) => void,
  imgSelected: boolean,
};

const LandingPage: FC<props> = ({ history, setFile, setUrl, setImgSrcType, imgSelected }) => {
  const imgSrc = 'https://mattrbailey.files.wordpress.com/2014/08/pushing-giant-boulder.png';
  const [afterImage, setAfterImage] = useState<string>();

  // fetch the after image
  useEffect(() => {
    const fetchAfterImage = async (): Promise<void> => {
      const uri = process.env.REACT_APP_API_URI! + '/services/imageTransformer';
      const body = new FormData();
      body.append('img', imgSrc);
      body.append('transformation', tr.saturate);

      type err = { message: string; };
      type resp = { imgUrl: string; };

      try {
        const req = await fetch(uri, { method: 'POST', body: body });
        const response: err | resp = await req.json();
        if (req.status < 200 || req.status >= 400)
          return alert(`Failed to fetch after image due to: ${(response as err).message}`);
        setAfterImage((response as resp).imgUrl);
      } catch (e) {
        return alert(`Failed to fetch image. ${(e as Error).name}: ${(e as Error).message}`);
      }
    };
    fetchAfterImage();
  }, []);

  const classes = useStyles();
  return (
    <Grid container direction="column" justify="flex-start" alignItems="center" spacing={2} className={classes.mainGrid}>
      <Grid item>
        <Typography variant="h3">Simple Image Transformer</Typography>
      </Grid>

      <Grid item>
        <Grid container direction="row" justify="center" spacing={2}>
          <Grid item>
            <img src={imgSrc} className={classes.exampleImage} />
          </Grid>
          <Grid item>
            <img src={afterImage} className={classes.exampleImage} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item style={{ width: '60%' }}>
        <SelectImageSource setFile={setFile} setUrl={setUrl} setImgSrcType={setImgSrcType} />
      </Grid>

      <Grid item>
        <Button component={Link} to='/transformer' variant="outlined" disabled={!imgSelected}>
          {imgSelected ? 'Continue' : 'Select an image to continue'}
        </Button>
      </Grid>

    </Grid>
  );
};

export default LandingPage;