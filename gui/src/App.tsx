import React, { FC, useState, useEffect } from 'react';
import HomePage from './HomePage';
import LandingPage from './pages/LandingPage';
import TransformationPage from './pages/TransformPage';
import DarkModeWrapper from './components/DarkModeWrapper';
import SnackbarWrapper from './alerts/SnackbarWrapper';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { imageSource } from './components/types';
import { v4 as uuidv4 } from 'uuid';

const App: FC = () => {

  const [imgSrcType, setImgSrcType] = useState<imageSource>();
  const [file, setFile] = useState<File | null>();
  const [url, setUrl] = useState<string>('');
  const [displayImage, setDisplayImage] = useState<string>('');
  const [fileSelectKey, setFileSelectKey] = useState<string>(uuidv4());

  const imgSelected: boolean = Boolean(file || url);

  useEffect(() => {
    if (imgSrcType === imageSource.file && file) {
      const blobPath: string = URL.createObjectURL(file);
      setDisplayImage(blobPath);
    } else if (imgSrcType === imageSource.url && url) {
      setDisplayImage(url);
      setFileSelectKey(uuidv4());
    }
  }, [file, url, imgSrcType]);

  return (
    <DarkModeWrapper>
      <SnackbarWrapper>
        <BrowserRouter>
          <Route exact path="/" render={(props) =>
            <LandingPage
              {...props}
              setFile={setFile}
              setUrl={setUrl}
              setImgSrcType={setImgSrcType}
              imgSelected={imgSelected}
            />}
          />
          <Route exact path="/transformer" component={TransformationPage} />
          <Route exact path="/old" component={HomePage} />
        </BrowserRouter>
      </SnackbarWrapper>
    </DarkModeWrapper>
  );
};

export default App;
