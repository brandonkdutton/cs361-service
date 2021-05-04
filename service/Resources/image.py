from flask import send_file
from flask_restful import Resource
from service.Utilities import FileDL
import os


class Image(Resource):
    """RESTful Image resource"""

    IMG_SAVE_DIR = f"{os.getcwd()}/imageUploads"

    def get(self, image_name):
        """returns and deletes an image stored on the file system"""

        # remove files from the save dir older than 5 minutes to save space
        FileDL.cleanup_saves(self.IMG_SAVE_DIR, 300)

        try:
            file_path = f"{self.IMG_SAVE_DIR}/{image_name}"
            return send_file(file_path)
        except FileNotFoundError:
            return {
                "message": f"file {image_name} could not be found. Files are only kept for 5 minutes so it may have been deleted."
            }
