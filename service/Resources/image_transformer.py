from flask import current_app
from flask.helpers import send_file
from flask_restful import Resource, request
from service.Utilities import BasicTransform, FileDL
import os


class ImageTransformer(Resource):
    IMG_SAVE_DIR = f"{os.getcwd()}/imageUploads"

    def get(self):
        try:
            file_name = request.args["img"]
            file_path = f"{self.IMG_SAVE_DIR}/{file_name}"
            send_file(file_path)
        except KeyError:
            return {"message": "url missing argument: 'img'"}
        except FileNotFoundError:
            return {"message": f"file: {file_name} could not be found"}
        else:
            os.remove(file_path)

    def post(self):
        # upload_folder = os.getcwd().join(self.UPLOAD_FOLDER)
        if not os.path.isdir(self.IMG_SAVE_DIR):
            os.mkdir(self.IMG_SAVE_DIR)

        transformation = request.form.get("transformation", None)
        img_type = request.form.get("imgType", None)

        allowed_content_types = {"image/png": "png", "image/jpeg": "jpg"}

        if img_type == "url":
            url = request.form.get("img", None)
            if url is None:
                return {"message": "no img value provided"}, 400

            file_path = FileDL.from_url(url, self.IMG_SAVE_DIR, allowed_content_types)
            if file_path is None:
                return {"message": "invalid image url"}, 400

            BasicTransform.saturate(file_path)

            # taken from https://stackoverflow.com/questions/8384737/extract-file-name-from-path-no-matter-what-the-os-path-format
            file_name = os.path.basename(file_path)
            bucket_url = current_app.config["BUCKET_URL"]
            fetch_url = f"{bucket_url}/{file_name}"

            return {"imgUrl": fetch_url}

        elif img_type == "file":
            file = request.files.get("img", None)

            file_path = FileDL.from_request_file(
                file, self.IMG_SAVE_DIR, allowed_content_types
            )
            file_name = os.path.basename(file_path)
            bucket_url = current_app.config["BUCKET_URL"]
            fetch_url = f"{bucket_url}/{file_name}"

            return {"imgUrl": fetch_url}, 200

        else:
            return {
                "message": "missing or invalid value for 'imgType'. Valid inputs are: 'url' and 'file'."
            }, 400
