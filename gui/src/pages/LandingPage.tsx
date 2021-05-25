import React, { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button, List, ListItem, ListItemText, Divider } from '@material-ui/core';
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
    maxHeight: '350px'
  },
  layoutContainer: {
    padding: theme.spacing(2),
    flexWrap: 'nowrap'
  },
  listContainer: {
    textAlign: 'center'
  },
  listTitle: {
    paddingBottom: theme.spacing(2)
  },
  listItem: {
    textAlign: 'center'
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
  //const imgSrc = 'https://mattrbailey.files.wordpress.com/2014/08/pushing-giant-boulder.png';
  const [afterImage, setAfterImage] = useState<string>();
  const [imgSrc, setImgSrc] = useState<string>('');

  // fetch the before image from Andrew Dunn's service
  // fetch code taken from Andrew Dunn's example code
  useEffect(() => {
    const fetchAndrewImage = async (): Promise<void> => {
      const serverURL = 'http://flip3.engr.oregonstate.edu:35351/api/image-scraper';
      let payload = JSON.stringify({ wikiURL: "https://en.wikipedia.org/wiki/Chicago", });
      let response = await fetch(serverURL, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: payload, mode: 'cors' });

      if (response.status < 200 || response.status >= 400)
        return alert("some error fetching Andrew's image");
      else {
        let body = await response.json();
        let untransformedURL = "http:" + body.imageURL;
        setImgSrc(untransformedURL ?? '');
      }
    };
    fetchAndrewImage();
  }, []);

  // fetch the after image
  useEffect(() => {
    if (!imgSrc) return;

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
  }, [imgSrc]);

  const classes = useStyles();
  return (
    <Grid container direction="column" justify="flex-start" alignItems="center" spacing={2} className={classes.mainGrid}>
      <Grid item className={classes.listItem}>
        <Typography variant="h3">Simple Image Transformer</Typography>
        <Typography>Preform basic image transformations quickly and easily</Typography>
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

      {/* source: https://material-ui.com/components/lists/#interactive */}
      <Grid item className={classes.listContainer}>
        <Typography variant='h6' className={classes.listTitle}>How do I use this?</Typography>
        <Divider />
        <List>
          <ListItem className={classes.listItem}>
            <ListItemText>1. Select an image from your computer or from a web url.</ListItemText>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText>2. Apply a basic transformation on the next page.</ListItemText>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText>3. Click the download button for your newly transformed image.</ListItemText>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText>4. Thats it! You're done.</ListItemText>
          </ListItem>
        </List>
      </Grid>

    </Grid>
  );
};

export default LandingPage;