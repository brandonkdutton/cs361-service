import React, { FC, useState, useRef, RefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App: FC = () => {
  const [fileInputKey, setFileInputKey] = useState<string>(uuidv4());
  const [img, setImg] = useState<string>();
  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  // validate and preview image file when user selects one
  const onFileChange = (): void => {
    const files = fileInput?.current?.files;
    if (!files)
      return;

    // based on: https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa
    const file: File = files[0];
    const fileObj: string = URL.createObjectURL(file);

    // based on: https://www.html5rocks.com/en/tutorials/file/dndfiles//
    if (!file.type.match("image.*")) {
      alert(`${file.name} is not an image file.`);

      // trick react into clearing the file input by re-rendering it.
      // based on: https://github.com/redux-form/redux-form/issues/769
      setFileInputKey(uuidv4());
      setImg(undefined);
      return;
    }

    setImg(fileObj);
  };

  return (
    <>
      <h2>Select an image to transform</h2>
      <form action="">
        <fieldset>
          <label htmlFor="fileUpload">Upload local image</label>
          <br />
          <input
            type="file"
            name="fileUpload"
            id="fileUpload"
            ref={fileInput}
            key={fileInputKey}
            onChange={onFileChange}
          />
        </fieldset>
        <h3>Or...</h3>
        <fieldset>
          <label htmlFor="imageUrlInput">enter image URL</label>
          <br />
          <input type="text" name="imageUrl" id="imageUrlInput" />
          <input type="button" value="Set URL" />
        </fieldset>
      </form>

      <img src={img} alt="" style={{ maxHeight: "400px" }} />
    </>
  );
};

export default App;
