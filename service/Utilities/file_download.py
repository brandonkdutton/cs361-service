from service.Utilities import BasicTransform
import werkzeug
import uuid
import time
import os
import requests


class FileDLException(Exception):
    """Indicates that some error occurred in this module"""

    def __init__(self, message):
        self.message = message


class FileDL:
    """Saves files from various sources to the file system"""

    @staticmethod
    def save_to_dir(file, save_dir, allowed_content_types):
        """Saves a file of from either a request.files object or a url"""

        if file is None:
            raise FileDLException("No file or file url in request")

        # delete saved images older than 5 minutes to save space
        FileDL.cleanup_saves(save_dir, 300)

        # save the file appropriately based on if it is a url or a file
        if str(type(file)) == str(werkzeug.datastructures.FileStorage):
            # if file type is a file
            return FileDL.from_request_file(file, save_dir, allowed_content_types)
        elif str(type(file)) == str(type("")):
            # if file type is a string containing a url
            return FileDL.from_url(file, save_dir, allowed_content_types)
        else:
            # some other file type
            raise FileDLException("Provied file is not a url string or a file")

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

    @staticmethod
    def cleanup_saves(dir, max_age):
        """deletes files from the specified directory over the max_age"""

        # based on https://stackoverflow.com/questions/10377998/how-can-i-iterate-over-files-in-a-given-directory
        # and https://stackoverflow.com/questions/16755394/what-is-the-easiest-way-to-get-current-gmt-time-in-unix-timestamp-format
        for file in os.listdir(dir):
            file_path = f"{dir}/{file}"
            created_time = os.path.getatime(file_path)
            cur_time = time.time()

            try:
                if cur_time - created_time > max_age:
                    os.remove(file_path)
            except FileNotFoundError:
                pass
