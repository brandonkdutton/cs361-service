import React, { FC, useEffect, useState } from 'react';
import FileSelect from './components/FileSelect';
import UrlSelect from './components/UrlSelect';
import TransformMenu from './components/TransformMenu';
import BeforeAndAfter from './components/BeforeAndAfter';
import { imageSource, transformations as tr } from './components/types';
import { v4 as uuidv4 } from 'uuid';

const HomePage: FC = () => {
  const [imgSrcType, setImgSrcType] = useState<imageSource>();
  const [file, setFile] = useState<File | null>();
  const [url, setUrl] = useState<string>('');
  const [displayImage, setDisplayImage] = useState<string>('');
  const [fileSelectKey, setFileSelectKey] = useState<string>(uuidv4());
  const [tran, setTran] = useState<tr>();

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

  const handleTransform = async (): Promise<void> => {
    const uri = process.env.REACT_APP_API_URI! + '/services/imageTransformer';
    const body = new FormData();
    body.append('img', imgSrcType === imageSource.file ? file! : url!);
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
      setUrl('');
      setFileSelectKey(uuidv4());
      setFile(null);
    } catch (e) {
      return alert((e as Error).message);
    }
  };

  return (
    <>
      <BeforeAndAfter />
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
      <TransformMenu
        setTr={setTran}
      />
      <button
        disabled={!tran || !(file || url)}
        onClick={handleTransform}
      >Transform</button>
      {displayImage && <a href={displayImage} download>Download image</a>}
      <br />
      <img src={displayImage} />
    </>
  );
};

export default HomePage;