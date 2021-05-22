import React, { FC, useState, useEffect } from 'react';
import HomePage from './HomePage';
import LandingPage from './pages/LandingPage';
import TransformationPage from './pages/TransformPage';
import DarkModeWrapper from './components/DarkModeWrapper';
import SnackbarWrapper from './alerts/SnackbarWrapper';
import { BrowserRouter, Route } from 'react-router-dom';
import { imageSource } from './components/types';

const App: FC = () => {
  const [imgSrcType, setImgSrcType] = useState<imageSource>();
  const [file, setFile] = useState<File | null>();
  const [url, setUrl] = useState<string>('');
  const [displayImage, setDisplayImage] = useState<string>('');

  const imgSelected: boolean = Boolean(file || url);

  // set display image based on current state of imgSrcType
  useEffect(() => {
    if (imgSrcType === imageSource.file && file) {
      const blobPath: string = URL.createObjectURL(file);
      setDisplayImage(blobPath);
    } else if (imgSrcType === imageSource.url && url) {
      setDisplayImage(url);
    }
  }, [file, url, imgSrcType]);

  useEffect(() => {

  }, [setDisplayImage]);

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
          <Route exact path="/transformer" render={(props) =>
            <TransformationPage
              {...props}
              file={file}
              url={url}
              src={imgSrcType}
              displayImage={displayImage}
              setFile={setFile}
              setUrl={setUrl}
              setImgSrcType={setImgSrcType}
              setDisplayImage={setDisplayImage}
            />}
          />
          <Route exact path="/old" component={HomePage} />
        </BrowserRouter>
      </SnackbarWrapper>
    </DarkModeWrapper>
  );
};

export default App;
