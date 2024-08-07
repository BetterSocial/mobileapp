import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {launchImageLibrary} from 'react-native-image-picker';

import StringConstant from '../../../utils/string/StringConstant';
import {Context} from '../../../context';
import {getChatName} from '../../../utils/string/StringUtils';
import {requestExternalStoragePermission} from '../../../utils/permission';
import ImageUtils from '../../../utils/image';

const useGroupSetting = ({navigation, route}) => {
  const [groupChatState] = React.useContext(Context).groupChat;

  const [channelState] = React.useContext(Context).channel;
  const [profile] = React.useContext(Context).profile;
  const [participants, setParticipants] = React.useState([]);
  const {channel} = channelState;
  const [groupName, setGroupName] = React.useState(
    getChatName(route.params.name, profile.myProfile.username) || 'Set Group Name'
  );
  const [countUser, setCountUser] = React.useState(0);
  const [changeName, setChangeName] = React.useState(false);
  const [changeImage, setChangeImage] = React.useState(false);
  const [base64Profile, setBase64Profile] = React.useState('');
  const [urlImage, setUrlImage] = React.useState(channel?.data?.image);
  const [isLoading, setIsLoading] = React.useState(false);
  const updateName = (text) => {
    setGroupName(text);
    setChangeName(true);
  };

  React.useEffect(() => {
    if (route?.params) {
      setParticipants(route?.params?.rawJson?.channel?.members);
      setCountUser(route?.params?.rawJson?.channel?.members?.length || 0);
    }
  }, [route]);

  const submitData = async (withNavigation = true, withLoading = true) => {
    let changeImageUrl = '';
    if (changeImage) {
      if (withLoading) setIsLoading(true);
      try {
        const res = await ImageUtils.uploadImage(urlImage);
        changeImageUrl = res.data.url;
      } catch (e) {
        setIsLoading(false);
        return;
      }
    }

    if (changeName || changeImage) {
      if (withLoading) setIsLoading(true);
      let dataEdit = {
        name: groupName
        // ...(changeImage && {image: base64Profile}),
      };
      if (changeName) {
        dataEdit = {...dataEdit, isEditName: true};
      }
      if (changeImage) {
        dataEdit.image = changeImageUrl;
      } else if (channel?.data?.image) {
        dataEdit.image = channel?.data?.image;
      }
      updateDataEdit(dataEdit, withNavigation);
    } else if (withNavigation) navigation.goBack();
  };

  const updateDataEdit = async (dataEdit, withNavigation) => {
    try {
      await channel.update(dataEdit);
      if (withNavigation) navigation.navigate('ChatDetailPage');
    } catch (e) {
      if (__DEV__) {
        console.log(`error : ${e}`);
      }
      SimpleToast.show(StringConstant.groupSettingUpdateFailed);
    }
    setIsLoading(false);
  };

  const lounchGalery = async () => {
    const {success, message} = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxHeight: 500,
          maxWidth: 500,
          includeBase64: true
        },
        (res) => {
          handleResLaunchGallery(res);
        }
      );
    } else {
      SimpleToast.show(message, SimpleToast.SHORT);
    }
  };

  const handleResLaunchGallery = (res) => {
    if (!res.didCancel) {
      const uri = res?.assets?.[0]?.uri;
      const base64 = res?.assets?.[0]?.base64;
      setChangeImage(true);
      setBase64Profile(base64);
      setUrlImage(uri);
    }
  };

  const renderHeaderSubtitleText = () => {
    if (changeImage || changeName) {
      return 'Finish';
    }
    return 'Skip';
  };

  return {
    updateName,
    renderHeaderSubtitleText,
    lounchGalery,
    submitData,
    countUser,
    groupChatState,
    channelState,
    profile,
    participants,
    channel,
    groupName,
    setGroupName,
    changeName,
    setChangeName,
    changeImage,
    setChangeImage,
    base64Profile,
    setBase64Profile,
    urlImage,
    setUrlImage,
    isLoading,
    setIsLoading,
    handleResLaunchGallery,
    updateDataEdit
  };
};

export default useGroupSetting;
