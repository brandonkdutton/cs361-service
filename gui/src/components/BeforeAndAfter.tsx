import React, { FC, useEffect, useState } from 'react';
import { transformations as tr } from './types';

const BeforeAndAfter: FC = () => {
  const imgSrc = 'https://mattrbailey.files.wordpress.com/2014/08/pushing-giant-boulder.png';
  const [afterImage, setAfterImage] = useState<string>();

  const imgStyle = {
    maxWidth: '300px'
  };

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 1,
    background: 'black',
    color: 'white'
  };

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

  return (
    <section>
      <label htmlFor="beforeImg" style={labelStyle}>Before</label>
      <img id='beforeImg' src={imgSrc} style={imgStyle} />
      <label htmlFor="afterImg" style={labelStyle}>After</label>
      <img id='afterImg' src={afterImage} style={imgStyle} />
    </section>
  );
};

export default BeforeAndAfter;