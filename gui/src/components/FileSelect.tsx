import React, { FC, useRef, RefObject } from 'react';
import { imageSource } from './types';

interface props {
  setImageSource: (src: imageSource) => void;
  setFile: (url: File) => void;
  forceRerender: () => void;
  forceRerenderKey: string;
}

const FileSelect: FC<props> = ({ setImageSource, setFile, forceRerenderKey, forceRerender }) => {
  const fileInputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const handleFileChange = (): void => {
    const file: File = fileInputRef!.current!.files![0];

    // based on: https://www.html5rocks.com/en/tutorials/file/dndfiles//
    if (!file.type.match("image.*")) {
      // trick from https://github.com/redux-form/redux-form/issues/769
      forceRerender();
      return alert(`${file.name} is not an image file.`);
    }
    setFile(file);
    setImageSource(imageSource.file);
  };

  return (
    <fieldset>
      <label htmlFor="fileUpload">Select image file</label>
      <br />
      <input
        type="file"
        name="fileUpload"
        id="fileUpload"
        ref={fileInputRef}
        key={forceRerenderKey}
        onChange={handleFileChange}
      />
    </fieldset>
  );
};

export default FileSelect;