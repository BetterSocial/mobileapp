import React from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

import {Context} from '../../../context';
import {getChatName} from '../../../utils/string/StringUtils';
import {requestExternalStoragePermission} from '../../../utils/permission';
import {setParticipants} from '../../../context/actions/groupChat';
import {uploadFile} from '../../../service/file';

const useGroupInfo = ({navigation}) => {
  const [groupChatState, groupPatchDispatch] = React.useContext(Context).groupChat;

  const {participants, asset} = groupChatState;
  const [channelState] = React.useContext(Context).channel;
  const [profile] = React.useContext(Context).profile;
  const {channel, profileChannel} = channelState;
  const [isLoadingMembers, setIsLoadingMembers] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState('');
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const username = channelState.channel?.data?.name;
  const createChat = channelState.channel?.data?.created_at;
  const countUser = Object.entries(participants).length;

  const serializeMembersList = (result = []) => {
    if (!result) {
      return {};
    }

    if (result.length === 0) {
      return {};
    }

    const membersObject = {};
    result.forEach((item) => {
      membersObject[item.user_id] = item;
    });
    return membersObject;
  };

  const getMembersList = async () => {
    try {
      const result = await channel.queryMembers({});
      const serializedMember = serializeMembersList(result.members);
      setParticipants(serializedMember, groupPatchDispatch);
      setIsLoadingMembers(false);
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
      setIsLoadingMembers(false);
    }
  };

  const chatName = getChatName(username, profile.myProfile.username);

  const onProfilePressed = (data) => {
    if (profile.myProfile.user_id === participants[data].user_id) {
      navigation.navigate('ProfileScreen', {
        isNotFromHomeTab: true
      });
      return;
    }

    navigation.navigate('OtherProfile', {
      data: {
        user_id: profile.myProfile.user_id,
        other_id: participants[data].user_id,
        username: participants[data].user.name
      }
    });
  };

  const handleOnNameChange = () => {
    navigation.push('GroupSetting', {
      username: chatName,
      focusChatName: true
    });
  };

  const handleOnImageClicked = () => {
    launchGallery();
  };

  const uploadImageBase64 = async (res) => {
    try {
      setIsUploadingImage(true);
      const result = await uploadFile(`data:image/jpeg;base64,${res.base64}`);
      setUploadedImage(result.data.url);
      const dataEdit = {
        name: chatName,
        image: result.data.url
      };

      await channel.update(dataEdit);
      setIsUploadingImage(false);
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
    }
  };

  const launchGallery = async () => {
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
          if (!res.didCancel) {
            uploadImageBase64(res);
          }
        }
      );
    }
  };

  return {
    serializeMembersList,
    groupChatState,
    groupPatchDispatch,
    participants,
    asset,
    channelState,
    profile,
    channel,
    profileChannel,
    isLoadingMembers,
    setIsLoadingMembers,
    uploadedImage,
    setUploadedImage,
    isUploadingImage,
    setIsUploadingImage,
    username,
    createChat,
    countUser,
    getMembersList,
    onProfilePressed,
    handleOnNameChange,
    handleOnImageClicked,
    uploadImageBase64,
    chatName,
    launchGallery
  };
};

export default useGroupInfo;
