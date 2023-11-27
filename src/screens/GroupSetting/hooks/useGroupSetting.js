import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {launchImageLibrary} from 'react-native-image-picker';

import {Linking} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useRecoilState, atom} from 'recoil';
import {Context} from '../../../context';
import {getChatName} from '../../../utils/string/StringUtils';
import {requestExternalStoragePermission} from '../../../utils/permission';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import ChannelList from '../../../database/schema/ChannelListSchema';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {CHAT_ATOM} from '../../../hooks/core/constant';
import StringConstant from '../../../utils/string/StringConstant';

const chatAtom = atom({
  key: CHAT_ATOM,
  default: {
    selectedChannel: null
  }
});

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

  const [countUser, setCountUser] = React.useState(0);
  const [changeName, setChangeName] = React.useState(false);
  const [changeImage, setChangeImage] = React.useState(false);
  const [base64Profile, setBase64Profile] = React.useState('');
  const [urlImage, setUrlImage] = React.useState(channel?.data?.image);
  const [isLoading, setIsLoading] = React.useState(false);
  const [chat, setChat] = useRecoilState(chatAtom);
  const updateName = (text) => {
    setGroupName(text);
    setChangeName(true);
  };

  React.useEffect(() => {
    console.log({route}, 'lebron');
    if (route?.params) {
      setParticipants(route?.params?.rawJson?.channel?.members);
      setCountUser(route?.params?.rawJson?.channel?.members?.length || 0);
    }
  }, [route]);
  const submitData = async (withNavigation = true, withLoading = true) => {
    try {
      const body = {
        channel_id: route?.params?.id,
        channel_name: groupName,
        channel_image: urlImage
      };
      console.log({body}, 'bodyman');
      const response = await SignedMessageRepo.editChannel(body);
      let newChannel = response.data?.channel;
      newChannel = {...chat.selectedChannel, ...newChannel};
      ChannelList.updateChannelInfo(
        localDb,
        body.channel_id,
        body.channel_name,
        body.channel_image,
        response
      );
      console.log({newChannel}, 'nehiks');
      if (newChannel) {
        setChat({
          ...chat,
          selectedChannel: newChannel
        });
      }
      refresh('channelList');
      refresh('chat');
      refresh('channelInfo');
      if (withNavigation) {
        navigation.goBack();
      }
    } catch (e) {
      SimpleToast.show(StringConstant.groupSettingUpdateFailed);
    }
  };

  // const handleChannelType = (channelType) => {
  //   if(channelType === 1) {
  //     return
  //   }
  // };

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
      Linking.openSettings();
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
    handleResLaunchGallery
  };
};

export default useGroupSetting;
