import React from 'react';
import {useNavigation} from '@react-navigation/core';

import {launchImageLibrary} from 'react-native-image-picker';
import {Alert} from 'react-native';
import {generateRandomId} from 'stream-chat-react-native-core';
import {Context} from '../../../context';
import {uploadFile} from '../../../service/file';
import {requestExternalStoragePermission} from '../../../utils/permission';
import {getChatName} from '../../../utils/string/StringUtils';
import {setChannel} from '../../../context/actions/setChannel';
import {checkUserBlock} from '../../../service/profile';

const useGroupInfo = () => {
  const [groupChatState, groupPatchDispatch] = React.useContext(Context).groupChat;
  //  const [client] = React.useContext(Context).client
  const navigation = useNavigation();
  const {participants, asset} = groupChatState;
  const [client] = React.useContext(Context).client;
  const [channelState] = React.useContext(Context).channel;
  const [profile] = React.useContext(Context).profile;
  const {channel, profileChannel} = channelState;
  const [isLoadingMembers, setIsLoadingMembers] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState('');
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const username = channelState.channel?.data?.name;
  const createChat = channelState.channel?.data?.created_at;
  const countUser = Object.entries(participants).length;
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [newParticipant, setNewParticipan] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [, dispatchChannel] = React.useContext(Context).channel;
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
      setNewParticipan(result.members);
      setIsLoadingMembers(false);
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
      setIsLoadingMembers(false);
    }
  };
  const memberName = () => {
    return getChatName(channelState?.channel?.data.name, profile.myProfile.username);
  };

  const chatName = getChatName(username, profile.myProfile.username);
  const onProfilePressed = () => {
    if (profile.myProfile.user_id === selectedUser.user_id) {
      navigation.navigate('ProfileScreen', {
        isNotFromHomeTab: true
      });
    }

    navigation.navigate('OtherProfile', {
      data: {
        user_id: profile.myProfile.user_id,
        other_id: selectedUser.user_id,
        username: selectedUser.user.name
      }
    });
    setSelectedUser(null);
  };
  const handleOnNameChange = () => {
    navigation.push('GroupSetting', {
      username: chatName,
      focusChatName: true,
      refresh: getMembersList
    });
  };
  // eslint-disable-next-line consistent-return
  const checkUserIsBlockHandle = async () => {
    try {
      const sendData = {
        user_id: selectedUser.user_id
      };
      const processGetBlock = await checkUserBlock(sendData);

      if (!processGetBlock.data.data.blocked && !processGetBlock.data.data.blocker) {
        return openChatMessage();
      }
      return onProfilePressed();
    } catch (e) {
      console.log(e, 'eman');
    }
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

  const initParticipant = (obj) => {
    const newData = [];
    if (typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        const newObj = {...obj[key]};
        newData.push(newObj);
      });
    }
    setNewParticipan(newData);
  };

  const handleSelectUser = async (user) => {
    if (user.user_id === profile.myProfile.user_id) return;
    await setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseSelectUser = async () => {
    // await setSelectedUser(null);
    setOpenModal(false);
  };

  const onRemoveUser = async () => {
    setOpenModal(false);

    try {
      const result = await channel.removeMembers([selectedUser.user_id]);
      const generatedChannelId = generateRandomId();
      const channelChat = await client.client.channel('system', generatedChannelId, {
        name: channelState?.channel?.data.name,
        type_channel: 'system',
        channel_type: 2
      });
      await channel.sendMessage(
        {
          text: `${profile.myProfile.username} removed ${selectedUser.user.name} from this group`,
          isRemoveMember: true,
          user_id: profile.myProfile.user_id,
          silent: true
        },
        {skip_push: true}
      );
      await channelChat.create();
      await channelChat.addMembers([selectedUser.user_id]);
      await channelChat.sendMessage(
        {
          text: `${profile.myProfile.username} removed you from ${channel.data.name}`,
          isRemoveMember: true,
          silent: true
        },
        {skip_push: true}
      );
      setNewParticipan(result.members);
    } catch (e) {
      console.log(e, 'eman');
    }
  };

  const openChatMessage = async () => {
    const members = [profile.myProfile.user_id];
    members.push(selectedUser.user_id);
    const filter = {type: 'messaging', members: {$eq: members}};
    const sort = [{last_message_at: -1}];
    const memberWithRoles = members.map((item) => ({
      user_id: item,
      channel_role: 'channel_moderator'
    }));
    const filterMessage = await client.client.queryChannels(filter, sort, {
      watch: true, // this is the default
      state: true
    });
    const generatedChannelId = generateRandomId();

    if (filterMessage.length > 0) {
      setChannel(filterMessage[0], dispatchChannel);
    } else {
      const channelChat = await client.client.channel('messaging', generatedChannelId, {
        name: selectedUser.user.name,
        type_channel: 1
      });
      await channelChat.create();
      await channelChat.addMembers(memberWithRoles);
      setChannel(channelChat, dispatchChannel);
    }
    setOpenModal(false);

    navigation.push('ChatDetailPage', {channel});
  };

  const alertRemoveUser = async (status) => {
    if (status === 'view') {
      setOpenModal(false);
      onProfilePressed();
    }
    if (status === 'remove') {
      Alert.alert(
        null,
        `Are you sure you want to remove ${selectedUser.user.name} from this group? We will let the group know that you removed ${selectedUser.user.name}.`,
        [{text: 'Yes - remove', onPress: () => onRemoveUser()}, {text: 'Cancel'}]
      );
    }

    if (status === 'message') {
      checkUserIsBlockHandle();
    }
  };
  const onLeaveGroup = () => {
    Alert.alert('Leave group', 'Are you sure you want to leave group ?', [
      {text: 'Yes', onPress: leaveGroup},
      {text: 'No'}
    ]);
  };

  const leaveGroup = async () => {
    try {
      await channel.sendMessage(
        {
          text: `${profile.myProfile.username} left`,
          isRemoveMember: true,
          silent: true
        },
        {skip_push: true}
      );
      const response = await channel.removeMembers([profile.myProfile.user_id]);
      navigation.reset({
        index: 1,
        routes: [
          {
            name: 'AuthenticatedStack',
            params: {
              screen: 'HomeTabs',
              params: {
                screen: 'ChannelList'
              }
            }
          }
        ]
      });
      setNewParticipan(response.members);
    } catch (e) {
      console.log(e, 'sayu');
    }
  };

  const handlePressContact = (item) => {
    if (newParticipant.length > 2) {
      handleSelectUser(item);
      return true;
    }
    return null;
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
    launchGallery,
    selectedUser,
    handleSelectUser,
    initParticipant,
    newParticipant,
    handleCloseSelectUser,
    onRemoveUser,
    openModal,
    leaveGroup,
    alertRemoveUser,
    memberName,
    onLeaveGroup,
    checkUserIsBlockHandle,
    handlePressContact
  };
};

export default useGroupInfo;