import React, { FC, useEffect, useState } from 'react';
import FileSelect from './components/FileSelect';
import UrlSelect from './components/UrlSelect';
import { imageSource } from './components/types';
import { v4 as uuidv4 } from 'uuid';

const HomePage: FC = () => {
  const [imgSrcType, setImgSrcType] = useState<imageSource>();
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState<string>('');
  const [displayImage, setDisplayImage] = useState<string>('');
  const [fileSelectKey, setFileSelectKey] = useState<string>(uuidv4());

  const setImageSource = (src: imageSource): void => {
    setImgSrcType(src);
  };

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
    <>
      <h2>Select an image source</h2>
      <FileSelect
        forceRerenderKey={fileSelectKey}
        forceRerender={() => setFileSelectKey(uuidv4())}
        setImageSource={setImageSource}
        setFile={(f: File) => setFile(f)}
      />
      <h3>Or...</h3>
      <UrlSelect
        setImageSource={setImageSource}
        setUrl={(url: string) => setUrl(url)}
      />
      <img src={displayImage} />
    </>
  );
};

export default HomePage;