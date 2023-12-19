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

const uploadFile = async (uri: string, name: string, type: string) => {
  try {
    const formData = new FormData();
    formData.append('photo', {
      uri,
      name,
      type
    });

    const url = await uploadPhoto(formData);
    return url;
  } catch (error) {
    console.log(error?.response);
    return uri;
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
  uploadFile,
  uploadImageWithoutAuth
};

export default ImageUtils;
