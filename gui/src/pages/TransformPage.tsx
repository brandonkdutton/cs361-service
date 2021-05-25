import React, { FC, useState, useContext } from 'react';
import { imageSource, transformations as tr } from '../components/types';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TransformerButtons from '../components/TransformerButtons';
import { transformHistoryItem as trHistItem } from '../components/types';

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
  const imgSrc = 'https://mattrbailey.files.wordpress.com/2014/08/pushing-giant-boulder.png';
  const [trHist, setTrHist] = useState<trHistItem[]>([
    { url: displayImage, timestamp: new Date() }
  ]);
  const [trHistIndex, setTrHistIndex] = useState<number>(0);

  const canUndo = (trHistIndex !== 0) && ((new Date().getTime() - trHist[trHistIndex - 1].timestamp.getTime()) / 1000 < 300);
  const canRedo = trHistIndex < trHist.length - 1;

  const undo = (): void => {
    const newIndex = trHistIndex - 1;
    setTrHistIndex(newIndex);
    setUrl(trHist[newIndex].url);
  };
  const redo = (): void => {
    const newIndex = trHistIndex + 1;
    setTrHistIndex(newIndex);
    setUrl(trHist[newIndex].url);
  };

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

      const newTrHist = trHist.slice(0, trHistIndex + 1);
      newTrHist.push({ url: imgUrl, timestamp: new Date() });
      setTrHist(newTrHist);
      setTrHistIndex(trHistIndex + 1);

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
        <img className={classes.exampleImage} src={trHist[trHistIndex].url} />
      </Grid>
      <Grid item><Typography>Basic transformations</Typography></Grid>
      <Grid item>
        <TransformerButtons
          history={history}
          displayImage={trHist[trHistIndex].url}
          transform={handleTransform}
          canUndo={canUndo}
          canRedo={canRedo}
          undo={undo}
          redo={redo}
          index={trHistIndex}
        />
      </Grid>
    </Grid>
  );
};

export default TransformationPage;