import { read } from "node:fs";
import React, { FC, useState, useRef, RefObject, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App: FC = () => {
  const [fileInputKey, setFileInputKey] = useState<string>(uuidv4());
  const [imgUrl, setImgUrl] = useState<string>();
  const [localImg, setLocalImg] = useState<string>();
  const [img, setImg] = useState<string>();
  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  // validate and preview image file when user selects one
  const onLocalFileChange = (): void => {
    const files: FileList = fileInput?.current?.files as FileList;
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
      return;
    }
    setLocalImg(fileObj);
  };

  const onImgUrlSelected = (): void => {
    setFileInputKey(uuidv4());
    setImg(imgUrl);
  };

  useEffect(() => {
    setImg(localImg ?? imgUrl);
  }, [localImg]);

  const submitTransformation = async (): Promise<void> => {
    const uri = `${process.env.REACT_APP_API_URI}/services/imageTransformer`;
    const body = new FormData();
    body.append('ImgUpload', localImg as string);
    body.append('ImgUrl', imgUrl as string);

    const req = await fetch(uri, {
      method: "POST",
      body: body
    });
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
            onChange={onLocalFileChange}
          />
        </fieldset>
        <h3>Or...</h3>
        <fieldset>
          <label htmlFor="imageUrlInput">enter image URL</label>
          <br />
          <input type="text" name="imageUrl" id="imageUrlInput" value={imgUrl} onChange={({ target }) => setImgUrl(target.value)} />
          <input type="button" value="Set URL" onClick={onImgUrlSelected} />
        </fieldset>
        <h3>Select a transformation to apply</h3>
        <fieldset>
          <select name="transformation" id="transformationSelect">
            <option selected value="None">None</option>
            <option value="Saturate">Saturate</option>
            <option value="Monochrome">Monochrome</option>
            <option value="Brighten">Brighten</option>
            <option value="Darken">Darken</option>
          </select>
          <input type="button" value="Submit transformation" onClick={submitTransformation} />
        </fieldset>
      </form>

      <img src={img} alt="" style={{ maxHeight: "400px" }} />
    </>
  );
};

export default App;
