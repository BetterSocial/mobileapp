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
  const formData = await compressAndPrepareFormData(imagePath);

  const imageUrl = await uploadPhoto(formData);
  return imageUrl;
};

const uploadImageWithoutAuth = async (imagePath: string) => {
  const formData = await compressAndPrepareFormData(imagePath);

  const imageUrl = await uploadPhotoWithoutAuth(formData);
  return imageUrl;
};

const ImageUtils = {
  uploadImage,
  uploadImageWithoutAuth
};

export default ImageUtils;
