// code modified from the example from https://material-ui.com/components/accordion/

import React, { FC, useRef, RefObject, useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { imageSource } from './types';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '100%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }),
);

interface props {
  setFile: (file: File | null) => void,
  setUrl: (url: string) => void,
  setImgSrcType: (src: imageSource) => void,
};

const ControlledAccordions: FC<props> = ({ setFile, setUrl, setImgSrcType }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const fileInputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const [managedUrl, setManagedUrl] = useState<string>('');
  const [fileSelectKey, setFileSelectKey] = useState<string>(uuidv4());

  const handleUrlSelected = (): void => {
    setUrl(managedUrl);
    setImgSrcType(imageSource.url);
  };

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleFileChange = async (): Promise<void> => {
    const file: File = fileInputRef!.current!.files![0];

    // based on: https://www.html5rocks.com/en/tutorials/file/dndfiles//
    if (!file.type.match("image.*")) {
      // trick from https://github.com/redux-form/redux-form/issues/769
      return alert(`${file.name} is not an image file.`);
    }

    const uri = process.env.REACT_APP_API_URI! + '/services/imageUpload';
    const body = new FormData();
    body.append('img', file);

    type error = { message: string; };
    type response = { imgUrl: string; };

    try {
      const req = await fetch(uri, { method: 'POST', body: body });
      const resp: response | error = await req.json();

      if (req.status < 200 || req.status >= 400)
        return alert((resp as error).message);

      const imgUrl: string = (resp as response).imgUrl;

      setUrl(imgUrl);
      setImgSrcType(imageSource.url);
    } catch (e) {
      return alert((e as Error).message);
    }
  };

  useEffect(() => {
    if (expanded !== 'panel1') {
      setFileSelectKey(uuidv4());
      setFile(null);
    }
    if (expanded !== 'panel2') {
      setUrl('');
      setManagedUrl('');
    }
  }, [expanded]);

  return (
    <div className={classes.root}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Transform an image from the web</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              {/*source: https://material-ui.com/components/text-fields/ */}
              <TextField
                id="outlined-full-width"
                label="Url"
                style={{ margin: 0 }}
                placeholder="My image url"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={(e) => setManagedUrl(e.target.value)}
                value={managedUrl}
              />
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={handleUrlSelected}>
                Select
               </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Transform an image from your computer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* source: https://stackoverflow.com/questions/40589302/how-to-enable-file-upload-on-reacts-material-ui-simple-input */}
          <Button
            component="label"
            variant="outlined"
          >
            Select file
           <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ControlledAccordions;
