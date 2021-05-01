from flask_restful import Resource, request
import requests
import os
import uuid


class ImageTransformer(Resource):
    def get(self):
        return " you got "

    def post(self):
        # upload_folder = os.getcwd().join(self.UPLOAD_FOLDER)
        upload_folder = "./imageUploads"
        if not os.path.isdir(upload_folder):
            os.mkdir(upload_folder)

        transformation = request.form.get("transformation", None)
        img_type = request.form.get("imgType", None)

        # uuid based on: https://stackoverflow.com/questions/534839/how-to-create-a-guid-uuid-in-python
        save_file_path = f"{upload_folder}/{uuid.uuid4()}"
        allowed_content_types = {"image/png": "png", "image/jpeg": "jpg"}

        if img_type == "url":
            url = request.form.get("img", None)
            if url is None:
                return {"message": "no img value provided"}, 400

            # based on: https://jdhao.github.io/2020/06/17/download_image_from_url_python/
            r = requests.get(url)
            content_type = r.headers.get("Content-Type", None)

            if content_type not in allowed_content_types:
                return {
                    "message": "invalid image format given in url. jpg and png only!"
                }, 400

            file_extention = allowed_content_types[content_type]
            file_name = f"{save_file_path}.{file_extention}"
            with open(file_name, "wb") as f:
                f.write(r.content)

            input("press enter to delete file")
            os.remove(file_name)

        elif img_type == "file":
            file = request.files.get("img", None)

            if file.content_type not in allowed_content_types:
                return {
                    "message": "invalid image format given in url. jpg and png only!"
                }, 400

            file_extention = allowed_content_types[file.content_type]
            file_name = f"{save_file_path}.{file_extention}"
            file.save(file_name)

            input("press enter to delete file")
            os.remove(file_name)

        else:
            return {
                "message": "missing or invalid value for 'imgType'. Valid inputs are: 'url' and 'file'."
            }, 400
