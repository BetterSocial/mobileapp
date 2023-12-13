import ImageCompressionUtils from './compress';
import {composeImageMeta} from '../string/file';
import {uploadPhoto, uploadPhotoWithoutAuth} from '../../service/file';

const compressAndPrepareFormData = async (imagePath: string) => {
  const compressedImage = await ImageCompressionUtils.compress(imagePath);
  const formData = new FormData();
  const photoMetaData = composeImageMeta(compressedImage);
  formData.append('photo', photoMetaData);

  return formData;
};

const uploadImage = async (imagePath: string) => {
  try {
    const formData = await compressAndPrepareFormData(imagePath);

    const imageUrl = await uploadPhoto(formData);
    return imageUrl;
  } catch (error) {
    console.log(error);
    return imagePath;
  }
};

const uploadImageWithoutAuth = async (imagePath: string) => {
  try {
    const formData = await compressAndPrepareFormData(imagePath);

    const imageUrl = await uploadPhotoWithoutAuth(formData);
    return imageUrl;
  } catch (error) {
    console.log(error);
    return imagePath;
  }
};

const ImageUtils = {
  uploadImage,
  uploadImageWithoutAuth
};

export default ImageUtils;
