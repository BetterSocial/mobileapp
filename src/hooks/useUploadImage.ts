import {Image} from 'react-native-compressor';
import {composeImageMeta} from '../utils/string/file';
import {uploadPhoto} from '../service/file';

const useUploadImage = () => {
  const uploadPhotoImage = async (pathImg: string) => {
    try {
      const compressionResult = await Image.compress(pathImg, {
        compressionMethod: 'auto'
      });
      const asset = new FormData();
      asset.append('photo', composeImageMeta(compressionResult));
      const responseUpload = await uploadPhoto(asset);
      return responseUpload;
    } catch (e) {
      return undefined;
    }
  };

  return {
    uploadPhotoImage
  };
};

export default useUploadImage;