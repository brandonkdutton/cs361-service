from flask import current_app
from flask_restful import Resource, request
from service.Utilities import FileDL, FileDLException
import os


class ImageUpload(Resource):
    IMG_SAVE_DIR = f"{os.getcwd()}/imageUploads"

    def post(self):
        allowed_content_types = {"image/png": "png", "image/jpeg": "jpg"}
        img_file = request.files.get("img", None)
        img_url = request.form.get("img", None)
        file_to_save = img_file or img_url

        try:
            file_path = FileDL.save_to_dir(
                file_to_save, self.IMG_SAVE_DIR, allowed_content_types
            )
        except FileDLException as e:
            return {"message": e.message}, 400

        # taken from https://stackoverflow.com/questions/8384737/extract-file-name-from-path-no-matter-what-the-os-path-format
        file_name = os.path.basename(file_path)
        bucket_url = current_app.config["BUCKET_URL"]
        fetch_url = f"{bucket_url}/{file_name}"

        return {"imgUrl": fetch_url}
