from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from . import config


def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    api = Api(app)
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config.from_object(config)

    from . import Resources

    # setup the RESTful resources
    api.add_resource(Resources.ImageTransformer, "/api/services/imageTransformer")

    return app