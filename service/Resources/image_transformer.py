from flask import Request
from flask_restful import Resource

class ImageTransformer(Resource):
    def get(self):
        return " you got "

    def post(self):
        return "you posted"

    def put(self):
        return "you put"