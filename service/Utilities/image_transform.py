from PIL import Image, ImageEnhance


class BasicTransform:
    """
    Provides interface for basic image transformations
    Reference: https://pillow.readthedocs.io/en/3.0.x/reference/ImageEnhance.html
    """

    @staticmethod
    def convert_image(image_path):
        """
        converts image to a format that can be transformed
        source: https://stackoverflow.com/questions/33831572/get-image-mode-pil-python
        """
        with Image.open(image_path) as img:
            if img.format == "PNG":
                new_image = img.convert("RGBA")
                new_image.save(image_path)

    @staticmethod
    def saturate(image_path, factor=4):
        """Increases image saturation by factor"""
        BasicTransform.convert_image(image_path)

        with Image.open(image_path) as img:
            filter = ImageEnhance.Color(img)
            new_image = filter.enhance(factor)
            new_image.save(image_path)

    @staticmethod
    def monochrome(image_path, factor=0):
        """makes an image monochromatic"""
        BasicTransform.saturate(image_path, factor)

    @staticmethod
    def darken(image_path, factor=0.5):
        """makes an image darker"""
        BasicTransform.convert_image(image_path)

        with Image.open(image_path) as img:
            filter = ImageEnhance.Brightness(img)
            new_image = filter.enhance(factor)
            new_image.save(image_path)

    @staticmethod
    def brighten(image_path, factor=1.5):
        """makes an image brighter"""
        BasicTransform.darken(image_path, factor)
