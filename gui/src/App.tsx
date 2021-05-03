import { exception } from "node:console";
import { read } from "node:fs";
import React, { FC, useState, useRef, RefObject, useEffect, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App: FC = () => {
  enum imageSource {
    url = "url",
    file = "file"
  };

  enum transformations {
    saturate = "saturate",
    monochrome = "monochrome",
    brighten = "brighten",
    darken = "darken"
  };

  const [fileInputKey, setFileInputKey] = useState<string>(uuidv4());
  const [displayImage, setDisplayImage] = useState<string>();
  const [imgSrc, setImgSrc] = useState<imageSource>();
  const [transformation, setTransformation] = useState<string>();
  const [urlImg, setUrlImg] = useState<string>();
  const [fileImg, setFileImg] = useState<string>();
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
    setFileImg(fileObj);
    setImgSrc(imageSource.file);
  };

  // set display image to url provided by user
  const onImgUrlSelected = (): void => {
    setFileInputKey(uuidv4());
    setImgSrc(imageSource.url);
  };

  useEffect(() => {
    setDisplayImage(imgSrc === imageSource.file ? fileImg : urlImg);
  }, [imgSrc]);

  const submitTransformation = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const body = new FormData();

    if (imgSrc === imageSource.file) {
      const files: FileList = fileInput?.current?.files as FileList;

      if (!files)
        return alert("no files selected?");

      body.append("img", files[0]);
      body.append("imgType", "file");
    } else if (imgSrc === imageSource.url) {
      if (!urlImg)
        return alert("no file url?");

      body.append("img", urlImg);
      body.append("imgType", "url");
    }

    if (!transformation)
      return alert("no transformation specified");
    else
      body.append("transformation", transformation);

    const uri = `${process.env.REACT_APP_API_URI}/services/imageTransformer`;
    type error = { message: string; };
    type response = { imgUrl: string; };

    try {
      const req = await fetch(uri, {
        method: "POST",
        body: body
      });
      const data: error | response = await req.json();

      if (req.status < 200 || req.status >= 400)
        return alert((data as error).message);

      const imgDlURL: string = (data as response).imgUrl;
      setDisplayImage(imgDlURL);
      setImgSrc(imageSource.url);

    } catch (e) {
      alert("some error");
    } finally {
      alert("some finally");
    }
  };

  return (
    <>
      <h2>Select an image to transform</h2>
      <form onSubmit={(e) => submitTransformation(e)}>
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
          <input type="text" name="imageUrl" id="imageUrlInput" value={urlImg} onChange={({ target }) => setUrlImg(target.value)} />
          <input type="button" value="Set URL" onClick={onImgUrlSelected} />
        </fieldset>
        <h3>Select a transformation to apply</h3>
        <fieldset>
          <select name="transformation" id="transformationSelect" value={transformation} onChange={({ target }) => setTransformation(target.value)}>
            <option selected disabled value="None">None</option>
            <option value="Saturate">Saturate</option>
            <option value="Monochrome">Monochrome</option>
            <option value="Brighten">Brighten</option>
            <option value="Darken">Darken</option>
          </select>
          <input type="submit" value="Submit transformation" />
        </fieldset>
      </form>

      <img src={displayImage} alt="" style={{ maxHeight: "400px" }} />
    </>
  );
};

export default App;
