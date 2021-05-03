from PIL import Image, ImageEnhance
import PIL


class BasicTransform:
    """Provides interface for basic image transformations"""

    @staticmethod
    def saturate(imagePath, factor=4):
        with Image.open(imagePath) as img:
            filter = ImageEnhance.Color(img)
            new_image = filter.enhance(factor)
            new_image.save(imagePath)
