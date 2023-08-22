import {Image} from 'react-native-compressor';

const compress = async (imagePath: string) => {
  const compressedImage = await Image.compress(imagePath, {
    compressionMethod: 'auto'
  });

  return compressedImage;
};

const ImageCompressionUtils = {
  compress
};

export default ImageCompressionUtils;
