import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {Alert} from 'react-native';
import {generateRandomId} from 'stream-chat-react-native-core';
import {launchImageLibrary} from 'react-native-image-picker';
import {openComposer} from 'react-native-email-link';
import {useNavigation} from '@react-navigation/core';
import {v4 as uuid} from 'uuid';

import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../../database/schema/ChannelListMemberSchema';
import UserSchema from '../../../database/schema/UserSchema';
import useChatUtilsHook from '../../../hooks/core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {Context} from '../../../context';
import {checkUserBlock} from '../../../service/profile';
import {getChatName} from '../../../utils/string/StringUtils';
import {getOrCreateAnonymousChannel} from '../../../service/chat';
import {requestExternalStoragePermission} from '../../../utils/permission';
import {setChannel} from '../../../context/actions/setChannel';
import {setParticipants} from '../../../context/actions/groupChat';
import {uploadFile} from '../../../service/file';
import TokenStorage, {ITokenEnum} from '../../../utils/storage/custom/tokenStorage';
import {isContainUrl} from '../../../utils/Utils';
import {ANONYMOUS_USER} from '../../../hooks/core/constant';

const useGroupInfo = () => {
  const [groupChatState, groupPatchDispatch] = React.useContext(Context).groupChat;
  const navigation = useNavigation();
  const {participants, asset} = groupChatState;
  const [client] = React.useContext(Context).client;
  const [channelState] = React.useContext(Context).channel;
  const [profile] = React.useContext(Context).profile;
  const {channel, profileChannel} = channelState;
  const [isLoadingMembers, setIsLoadingMembers] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState('');
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [username, setUsername] = React.useState(channelState.channel?.data?.name);
  const createChat = channelState.channel?.data?.created_at;
  const countUser = Object.entries(participants).length;
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [newParticipant, setNewParticipan] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [isAnonymousModalOpen, setIsAnonymousModalOpen] = React.useState(false);
  const [isFetchingAllowAnonDM, setIsFetchingAllowAnonDM] = React.useState(false);
  const [, dispatchChannel] = React.useContext(Context).channel;
  const {goToChatScreen} = useChatUtilsHook();
  const {localDb} = useLocalDatabaseHook();

  const blockModalRef = React.useRef(null);

  const anonUserEmojiName = channelState?.channel?.data?.anon_user_info_emoji_name;

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
    setIsLoadingMembers(true);
    try {
      const result = await channel.queryMembers({});
      setNewParticipan(result.members);
      setParticipants(result.members, groupPatchDispatch);

      setIsLoadingMembers(false);
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
      setIsLoadingMembers(false);
    }
  };
  const memberName = () => {
    if (anonUserEmojiName) return `Anonymous ${anonUserEmojiName}`;
    return getChatName(username, profile.myProfile.username);
  };
  const chatName = getChatName(username, profile.myProfile.username);
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
      return handleOpenProfile(selectedUser);
    } catch (e) {
      console.log(e, 'erro');
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
    const defaultUserData = {...user};
    defaultUserData.allow_anon_dm = false;
    try {
      setIsFetchingAllowAnonDM(true);
      await AnonymousMessageRepo.checkIsTargetAllowingAnonDM(user.user_id);
      defaultUserData.allow_anon_dm = true;
    } catch (e) {
      console.log(e);
    } finally {
      await setSelectedUser(defaultUserData);
      setOpenModal(true);
      setIsFetchingAllowAnonDM(false);
    }
  };

  const handleCloseSelectUser = async () => {
    setOpenModal(false);
    setIsAnonymousModalOpen(false);
  };

  const generateSystemChat = async (message, userSelected) => {
    try {
      if (!message) message = '';
      const generatedChannelId = generateRandomId();
      const channelChat = await client.client.channel('system', generatedChannelId, {
        name: channelState?.channel?.data.name,
        type_channel: 'system',
        channel_type: 2,
        image: channelState.channel.data.image
      });
      await channelChat.create();
      await channelChat.addMembers([userSelected]);
      await channelChat.sendMessage(
        {
          text: message,
          isRemoveMember: true,
          silent: true
        },
        {skip_push: true}
      );
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
    }
  };

  const updateMemberName = (members = []) => {
    if (!channel.data.isEditName && members.length > 0) {
      members = members.map((member) => member.user.name).join(',');
      setUsername(members);
      if (members.length > 1) {
        channel?.update({
          name: members
        });
      }
    }
  };

  const onRemoveUser = async () => {
    setOpenModal(false);
    try {
      const result = await channel.removeMembers([selectedUser.user_id]);
      const updateParticipant = newParticipant.filter(
        (participant) => participant.user_id !== selectedUser.user_id
      );
      setNewParticipan(updateParticipant);
      updateMemberName(result.members);
      await channel.sendMessage(
        {
          text: `${profile.myProfile.username} removed ${selectedUser.user.name} from this group`,
          isRemoveMember: true,
          user_id: profile.myProfile.user_id,
          silent: true
        },
        {skip_push: true}
      );
      await generateSystemChat(
        `${profile.myProfile.username} removed you from this group`,
        selectedUser.user_id
      );
      setNewParticipan(result.members);
      setParticipants(result.members, groupPatchDispatch);
    } catch (e) {
      if (__DEV__) {
        console.log(e, 'error');
      }
    }
  };

  const openChatMessage = async () => {
    await setOpenModal(false);
    const members = [profile.myProfile.user_id];
    members.push(selectedUser.user_id);
    const filter = {type: 'messaging', members: {$eq: members}};
    const sort = [{last_message_at: -1}];
    const memberWithRoles = members.map((item) => ({
      user_id: item,
      channel_role: 'channel_moderator'
    }));
    const user = {
      id: profile?.myProfile?.user_id
    };
    const token = TokenStorage.get(ITokenEnum.token);
    await setOpenModal(false);
    try {
      await client.client.connectUser(user, token);
      const filterMessage = await client.client.queryChannels(filter, sort, {
        watch: true, // this is the default
        state: true
      });
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
          },
          {
            name: 'AuthenticatedStack',
            params: {
              screen: 'ChatDetailPage'
            }
          }
        ]
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
    } catch (e) {
      console.log({e, client}, 'error');
    }
  };

  const blockAnonUser = async () => {
    try {
      setIsAnonymousModalOpen(false);
      const blockComponentValue = {
        postId: null,
        isAnonymousUserFromGroupInfo: true,
        actor: {
          id: selectedUser?.user?.id,
          data: {
            username: selectedUser?.user?.anonymousUsername
          }
        }
      };
      blockModalRef?.current?.openBlockComponent(blockComponentValue);
    } catch (e) {
      SimpleToast.show('failed to block anonymous user');
      console.log(e);
    }
  };

  const handleMessageAnonymously = async () => {
    if (!selectedUser?.allow_anon_dm) {
      SimpleToast.show('This user does not allow anonymous messages');
      return;
    }

    try {
      setOpenModal(false);
      const response = await getOrCreateAnonymousChannel(selectedUser?.user_id);
      const targetRawJson = {
        type: 'notification.message_new',
        cid: response?.channel?.id,
        channel_id: '',
        channel_type: 'messaging',
        channel: response?.channel,
        created_at: response?.channel,
        targetName: selectedUser?.user?.name,
        targetImage: selectedUser?.user?.image
      };
      const channelList = ChannelList.fromMessageAnonymouslyAPI({
        channel: response?.channel,
        members: response?.members,
        appAdditionalData: {
          rawJson: targetRawJson,
          message: '',
          targetName: selectedUser?.user?.name,
          targetImage: selectedUser?.user?.image
        }
      });

      await channelList.saveIfLatest(localDb);
      try {
        response?.members?.forEach(async (member) => {
          const userMember = UserSchema.fromMemberWebsocketObject(member, response?.channel?.id);
          await userMember.saveOrUpdateIfExists(localDb);

          const memberSchema = ChannelListMemberSchema.fromWebsocketObject(
            response?.channel?.id,
            uuid(),
            member
          );
          await memberSchema.save(localDb);
        });
      } catch (e) {
        console.log('error on memberSchema');
        console.log(e);
      }

      setOpenModal(false);
      goToChatScreen(channelList);
    } catch (e) {
      SimpleToast.show(e || 'Failed to message this user anonymously');
    }
  };

  /**
   *
   * @param {('view' | 'remove' | 'message' | 'block' | 'message-anonymously')} status
   */
  const alertRemoveUser = async (status) => {
    if (status === 'view') {
      setOpenModal(false);
      handleOpenProfile(selectedUser).catch((e) => console.log(e));
    }
    if (status === 'remove') {
      Alert.alert(
        null,
        `Are you sure you want to remove ${selectedUser.user.name} from this group? We will let the group know that you removed ${selectedUser.user.name}.`,
        [{text: 'Yes - remove', onPress: () => onRemoveUser()}, {text: 'Cancel'}]
      );
    }

    if (status === 'block') {
      blockAnonUser();
    }

    if (status === 'message') {
      await checkUserIsBlockHandle();
    }

    if (status === 'message-anonymously') {
      handleMessageAnonymously();
    }
  };
  const onLeaveGroup = () => {
    Alert.alert('', 'Exit this group?', [{text: 'Cancel'}, {text: 'Exit', onPress: leaveGroup}]);
  };

  const leaveGroup = async () => {
    try {
      const response = await channel.removeMembers([profile.myProfile.user_id]);
      await generateSystemChat('You left this group', profile.myProfile.user_id);
      SimpleToast.show('You left this chat');
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

  const onReportGroup = () => {
    openComposer({
      to: 'contact@bettersocial.org',
      subject: 'Reporting a group',
      body: `Reporting group ${
        channelState.channel?.data?.name || ''
      }. Please type reason for reporting this group below. Thank you!`
    });
  };
  const handlePressContact = async (item) => {
    const isAnonymousUser = !isContainUrl(item?.user?.image) || item?.user?.name === ANONYMOUS_USER;
    if (item?.user_id === profile?.myProfile?.user_id) return;

    if (anonUserEmojiName || isAnonymousUser) {
      const modifiedUser = {...item};
      modifiedUser.user.anonymousUsername = `Anonymous ${anonUserEmojiName}`;
      setSelectedUser(modifiedUser);
      setIsAnonymousModalOpen(true);
      return;
    }

    await handleSelectUser(item);
  };

  const handleOpenProfile = async (item) => {
    await setOpenModal(false);
    setTimeout(() => {
      if (profile?.myProfile?.user_id === item?.user_id) {
        return null;
      }

      return navigation.push('OtherProfile', {
        data: {
          user_id: profile.myProfile.user_id,
          other_id: item?.user_id,
          username: item?.user?.name
        }
      });
    }, 500);
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
    handlePressContact,
    handleOpenProfile,
    onReportGroup,
    setUsername,
    setSelectedUser,
    openChatMessage,
    generateSystemChat,
    setNewParticipan,
    isAnonymousModalOpen,
    setIsAnonymousModalOpen,
    blockModalRef,
    isFetchingAllowAnonDM
  };
};

export default useGroupInfo;
