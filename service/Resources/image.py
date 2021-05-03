from flask import send_file, after_this_request
from flask_restful import Resource, request
import os


class Image(Resource):
    """RESTful Image resource"""

    IMG_SAVE_DIR = f"{os.getcwd()}/imageUploads"

    def get(self, image_name):
        """returns and deletes an image stored on the file system"""
        try:
            file_path = f"{self.IMG_SAVE_DIR}/{image_name}"
            return send_file(file_path)
        except FileNotFoundError:
            return {
                "message": f"file {image_name} could not be found. Files are only kept for 5 minutes so it may have been deleted."
            }
