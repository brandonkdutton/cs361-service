from service.Utilities import BasicTransform
import uuid
import os
import requests


class FileDLException(Exception):
    """Indicates that some error occurred in this module"""

    def __init__(self, message):
        self.message = message


class FileDL:
    """Saves files from various sources to the file system"""

    @staticmethod
    def from_url(url, save_dir, allowed_content_types):
        """Saves a file from a url to the file system"""

        if url is None:
            raise FileDLException("no url provided")

        # based on: https://jdhao.github.io/2020/06/17/download_image_from_url_python/
        r = requests.get(url)
        content_type = r.headers.get("Content-Type", None)

        if content_type not in allowed_content_types:
            raise FileDLException(f"file type {content_type} is not allowed")

        if not os.path.isdir(save_dir):
            os.mkdir(save_dir)

        file_extention = allowed_content_types[content_type]
        file_name = f"{uuid.uuid4()}.{file_extention}"
        file_path = f"{save_dir}/{file_name}"
        with open(file_path, "wb") as f:
            f.write(r.content)

        return file_path

    @staticmethod
    def from_request_file(file, save_dir, allowed_content_types):
        """Saves a file from a request's files field to the file system"""

        if file is None:
            raise FileDLException("no file provided")
        elif file.content_type not in allowed_content_types:
            raise FileDLException(f"file type {file.content_type} is not allowed")

        if not os.path.isdir(save_dir):
            os.mkdir(save_dir)

        file_extention = allowed_content_types[file.content_type]
        file_name = f"{uuid.uuid4()}.{file_extention}"
        file_path = f"{save_dir}/{file_name}"
        file.save(file_path)

        return file_path
