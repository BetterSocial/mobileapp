import ImageCompressionUtils from './compress';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import {composeImageMeta} from '../string/file';
import {uploadPhoto, uploadPhotoWithoutAuth} from '../../service/file';

export type UploadOptions = {
  withSuccessfulEventTrack?: BetterSocialEventTracking;
  withFailedEventTrack?: BetterSocialEventTracking;
  withSuccessfulEventTrackData?: object;
  withFailedEventTrackData?: object;
};

const compressAndPrepareFormData = async (imagePath: string) => {
  const compressedImage = await ImageCompressionUtils.compress(imagePath);
  const formData = new FormData();
  const photoMetaData = composeImageMeta(compressedImage);
  formData.append('photo', photoMetaData);

  return formData;
};

const sendAnalyticsEventTracking = (
  imagePath: string,
  success: boolean,
  options: UploadOptions
) => {
  if (success && options?.withSuccessfulEventTrack) {
    AnalyticsEventTracking.eventTrack(
      options?.withSuccessfulEventTrack,
      options?.withSuccessfulEventTrackData
    );
  } else if (!success && options?.withFailedEventTrack) {
    AnalyticsEventTracking.eventTrack(
      options?.withFailedEventTrack,
      options?.withFailedEventTrackData
    );
  }
};

const uploadImage = async (imagePath: string, options: UploadOptions = {}) => {
  try {
    const formData = await compressAndPrepareFormData(imagePath);

    const imageUrl = await uploadPhoto(formData);
    return imageUrl;
  } catch (error) {
    console.log(error);
    sendAnalyticsEventTracking(imagePath, false, options);
    return imagePath;
  }
};

const uploadFile = async (uri: string, name: string, type: string, options: UploadOptions = {}) => {
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
    sendAnalyticsEventTracking(uri, false, options);
    return uri;
  }
};

const uploadImageWithoutAuth = async (imagePath: string, options: UploadOptions = {}) => {
  try {
    const formData = await compressAndPrepareFormData(imagePath);

    const imageUrl = await uploadPhotoWithoutAuth(formData);
    return imageUrl;
  } catch (error) {
    console.log(error);
    sendAnalyticsEventTracking(imagePath, false, options);
    return imagePath;
  }
};

const ImageUtils = {
  uploadImage,
  uploadFile,
  uploadImageWithoutAuth
};

export default ImageUtils;
