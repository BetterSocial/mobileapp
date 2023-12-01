/* eslint-disable consistent-return */
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {launchImageLibrary} from 'react-native-image-picker';

import {Linking} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useRecoilState} from 'recoil';
import {Context} from '../../../context';
import {getChatName, isValidUrl} from '../../../utils/string/StringUtils';
import {requestExternalStoragePermission} from '../../../utils/permission';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import ChannelList from '../../../database/schema/ChannelListSchema';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {CHANNEL_GROUP} from '../../../hooks/core/constant';
import StringConstant from '../../../utils/string/StringConstant';
import {chatAtom} from '../../../hooks/core/chat/useChatUtilsHook';
import useUploadImage from '../../../hooks/useUploadImage';

const useGroupSetting = ({route}) => {
  const [groupChatState] = React.useContext(Context).groupChat;
  const navigation = useNavigation();
  const [channelState] = React.useContext(Context).channel;
  const [profile] = React.useContext(Context).profile;
  const [participants, setParticipants] = React.useState([]);
  const {channel} = channelState;
  const [groupName, setGroupName] = React.useState(
    getChatName(route.params.name, profile.myProfile.username) || 'Set Group Name'
  );
  const {localDb, refresh} = useLocalDatabaseHook();
  const [loadingUpdate, setLoadingUpdate] = React.useState(false);
  const [countUser, setCountUser] = React.useState(0);
  const [changeName, setChangeName] = React.useState(false);
  const [changeImage, setChangeImage] = React.useState(false);
  const [base64Profile, setBase64Profile] = React.useState('');
  const [urlImage, setUrlImage] = React.useState(channel?.data?.image);
  const [isLoading, setIsLoading] = React.useState(false);
  const [chat, setChat] = useRecoilState(chatAtom);
  const {uploadPhotoImage} = useUploadImage();
  const {selectedChannel} = chat;
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

  React.useEffect(() => {
    if (selectedChannel) {
      setUrlImage(selectedChannel?.channelPicture);
    }
  }, [selectedChannel]);
  const submitData = async (withNavigation = true) => {
    if (!changeImage && !changeName) return navigation.goBack();
    try {
      setLoadingUpdate(true);
      let body = {
        channel_id: route?.params?.id,
        channel_name: groupName,
        channel_image: urlImage
      };
      if (urlImage && !isValidUrl(urlImage)) {
        try {
          const res = await uploadPhotoImage(urlImage);
          if (res) {
            body = {...body, channel_image: res.data.url};
          }
        } catch (e) {
          console.log(e, 'error upload');
        }
      }
      const response = await SignedMessageRepo.editChannel(body);
      let newChannel = response.data?.channel;
      newChannel = {
        ...chat.selectedChannel,
        ...newChannel,
        channelType: handleChannelType(newChannel?.channelType),
        channelPicture: body?.channel_image
      };
      ChannelList.updateChannelInfo(
        localDb,
        body.channel_id,
        body.channel_name,
        body.channel_image
      );
      if (newChannel) {
        setChat({
          ...chat,
          selectedChannel: newChannel
        });
      }
      refresh('channelInfo');
      refresh('chat');

      refresh('channelList');

      if (withNavigation) {
        navigation.goBack();
      }
      setLoadingUpdate(false);
    } catch (e) {
      setLoadingUpdate(false);
      SimpleToast.show(StringConstant.groupSettingUpdateFailed);
    }
  };

  const handleChannelType = (channelType) => {
    if (channelType === 1) {
      return CHANNEL_GROUP;
    }
    return channelType;
  };

  const lounchGalery = async () => {
    const {success} = await requestExternalStoragePermission();
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
      Linking.openSettings();
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
    loadingUpdate
  };
};

export default useGroupSetting;
