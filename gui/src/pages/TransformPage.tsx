import React, { FC } from 'react';
import { imageSource, transformations as tr } from '../components/types';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TransformerButtons from '../components/TransformerButtons';

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
  file: File | undefined | null;
  url: string;
  src: imageSource | undefined;
  displayImage: string;
  setDisplayImage: (url: string) => void;
  setFile: (file: File | null) => void;
  setUrl: (url: string) => void;
  setImgSrcType: (src: imageSource) => void;
};

const TransformationPage: FC<props> = ({ history, file, url, src, displayImage, setDisplayImage, setFile, setUrl, setImgSrcType }) => {
  const classes = useStyles();
  type nullish = null | undefined;
  const imgSrc = 'https://mattrbailey.files.wordpress.com/2014/08/pushing-giant-boulder.png';

  const handleTransform = async (tran: tr): Promise<void> => {
    const uri = process.env.REACT_APP_API_URI! + '/services/imageTransformer';
    const body = new FormData();
    body.append('img', src === imageSource.file ? file! : url!);
    body.append('transformation', tran ?? '');

    type error = { message: string; };
    type response = { imgUrl: string; };

    try {
      const req = await fetch(uri, { method: 'POST', body: body });
      const resp: response | error = await req.json();

      if (req.status < 200 || req.status >= 400)
        return alert((resp as error).message);

      const imgUrl: string = (resp as response).imgUrl;
      setDisplayImage(imgUrl);
      setUrl(imgUrl);
      setFile(null);
      setImgSrcType(imageSource.url);
    } catch (e) {
      return alert((e as Error).message);
    }
  };

  return (
    <Grid container direction='column' spacing={2} alignItems='center' className={classes.mainGrid}>
      <Grid item>
        <Typography variant='h3'>Apply a transformation</Typography>
      </Grid>
      <Grid item>
        <img className={classes.exampleImage} src={displayImage || imgSrc} />
      </Grid>
      <Grid item>
        <TransformerButtons
          history={history}
          displayImage={displayImage}
          transform={handleTransform}
        />
      </Grid>
    </Grid>
  );
};

export default TransformationPage;