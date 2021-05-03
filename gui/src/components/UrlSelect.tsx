import React, { FC, useState } from 'react';
import { imageSource } from './types';

interface props {
  setImageSource: (src: imageSource) => void;
  setUrl: (url: string) => void;
}

const UrlSelect: FC<props> = ({ setImageSource, setUrl }) => {
  const [managedUrl, setManagedUrl] = useState<string>('');

  const handleUrlSelected = (): void => {
    setUrl(managedUrl);
    setImageSource(imageSource.url);
  };

  return (
    <fieldset>
      <label htmlFor="imageUrlInput">Enter image URL</label>
      <br />
      <input
        type="text"
        id="imageUrlInput"
        value={managedUrl}
        onChange={(e) => setManagedUrl(e.target.value)}
      />
      <input
        type="button"
        value="Set URL"
        onClick={handleUrlSelected}
      />
    </fieldset>
  );
};

export default UrlSelect;