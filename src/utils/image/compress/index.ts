import {Image} from 'react-native-compressor';

const compress = async (imagePath: string, type: 'base64' | 'uri' = 'uri') => {
  const compressedImage = await Image.compress(imagePath, {
    compressionMethod: 'auto',
    input: type,
    returnableOutputType: type
  });

  return compressedImage;
};

const ImageCompressionUtils = {
  compress
};

export default ImageCompressionUtils;
