import React from 'react'
import { launchImageLibrary } from 'react-native-image-picker';
import SimpleToast from 'react-native-simple-toast';
import { Context } from '../../../context';
import { uploadFile } from '../../../service/file';
import { requestExternalStoragePermission } from '../../../utils/permission';
import StringConstant from '../../../utils/string/StringConstant';
import { getChatName } from '../../../utils/string/StringUtils';

const useGroupSetting = ({navigation, route}) => {
    const [groupChatState] = React.useContext(Context).groupChat;
    const [channelState] = React.useContext(Context).channel;
    const [profile] = React.useContext(Context).profile;
    const {participants} = groupChatState;
    const {channel} = channelState;
    const [groupName, setGroupName] = React.useState(
        getChatName(route.params.username, profile.myProfile.username) || 'Set Group Name',
    );
    const [countUser] = React.useState(Object.entries(participants).length);
    const [changeName, setChangeName] = React.useState(false);
    const [changeImage, setChangeImage] = React.useState(false);
    const [base64Profile, setBase64Profile] = React.useState('');
    const [urlImage, setUrlImage] = React.useState(channel?.data?.image);
    const [isLoading, setIsLoading] = React.useState(false);
    const updateName = (text) => {
    setGroupName(text);
    setChangeName(true);
  };

  const submitData = async (withNavigation = true, withLoading = true) => {
    let changeImageUrl = '';
    if (changeImage) {
      if(withLoading) setIsLoading(true);
      try {
        const res = await uploadFile(`data:image/jpeg;base64,${base64Profile}`);
        changeImageUrl = res.data.url;
      } catch (e) {
        setIsLoading(false);
        return;
      }
    }

    if (changeName || changeImage) {
      if(withLoading) setIsLoading(true);
      const dataEdit = {
        name: groupName,
        // ...(changeImage && {image: base64Profile}),
      };
      if (changeImage) {
        dataEdit.image = changeImageUrl;
      } else if (channel?.data?.image) {
          dataEdit.image = channel?.data?.image;
        }

      try {
        await channel.update(dataEdit);
        if(withNavigation) navigation.navigate('ChannelList');
      } catch (e) {
        if (__DEV__) {
          console.log(`error : ${e}`)
        }
        SimpleToast.show(StringConstant.groupSettingUpdateFailed)
      }
      setIsLoading(false);
    } else if(withNavigation) navigation.goBack();
  };

   const lounchGalery = async () => {
    const {success, message} = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxHeight: 500,
          maxWidth: 500,
          includeBase64: true,
        },
        (res) => {
          if (!res.didCancel) {
            setChangeImage(true);
            setBase64Profile(res.base64);
            setUrlImage(res.uri);
          }
        },
      );
    } else {
      SimpleToast.show(message, SimpleToast.SHORT);
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
    setIsLoading  
  }

}


export default useGroupSetting