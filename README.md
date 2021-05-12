# cs361-project
cs361-project

* The service can be accessed at the url: 
    http://flip2.engr.oregonstate.edu:59835/api/services/imageTransformer

* It can do the following transformations on png and jpg images:
    1. "saturate"
    2. "monochrome"
    3. "brighten"
    4. "darken"

* The service can transform images give either as a blob image file, ie. an html file   upload input form, OR from a valid image url ie. "http"//myImage.jpg"

* To transform an image from a url you may use the following javascript code where
    1. "myTransformation" is a string that is one of the four transformations mentioned above, ie. "saturate"
    2. where "myImageUrl" is a valid url to a png or jpg ie. "http://myImage.jpg"

```javascript
const transformFromUrl = async () => {
    const uri = 'http://flip2.engr.oregonstate.edu:59835/api/services/imageTransformer';
    const body = new FormData();
    body.append('img', myImageUrl);
    body.append('transformation', myTransformation ?? '');

    try {
        const req = await fetch(uri, { method: 'POST', body: body });
        const response = await req.json();

        if (req.status < 200 || req.status >= 400)
            return alert(response.message);
        else
            return response.imgUrl;
    } catch (e) {
        return alert(e.message);
    }
};
```

* To do a transformation from an image upload blob file use the following code:
    **please note* if you don't know what a blob file is, then it's probably just easier to use the image url option.
    * A blob file is the result of calling ```createObjectURL() ``` on the value of an image upload from an html <input type="fileUpload"> 

```javascript
const transformFromFile = async () => {
    const uri = 'http://flip2.engr.oregonstate.edu:59835/api/services/imageTransformer';
    const body = new FormData();
    body.append('img', myBlobFile);
    body.append('transformation', myTransformation ?? '');

    try {
        const req = await fetch(uri, { method: 'POST', body: body });
        const response = await req.json();

        if (req.status < 200 || req.status >= 400)
            return alert(response.message);
        else
            return response.imgUrl;
    } catch (e) {
        return alert(e.message);
    }
};
```

* upon successful completion of either of the above codes, JSON will be returned in the form of:
    ```json
    {
        "imgUrl": "http://urlToDownloadTheTransformedImage.jpgOrPng"
    }
    ```
* if an error occurs, json will be returned in the form of: 
    ```json
    {
        "message": "some informative error message"
    }
    ```
* To download the transformed image just do a GET request on the value of the json's imgUrl field.
    * you could also just to something like:
    ```html
    <html>
        <img src="http://urlToDownloadTheTransformedImage.jptOrPng"><img>
    </html>
    ```

** If you have any problems then please ask me for help **
