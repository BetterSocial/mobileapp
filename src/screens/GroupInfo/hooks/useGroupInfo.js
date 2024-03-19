import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {Alert} from 'react-native';
import {generateRandomId} from 'stream-chat-react-native-core';
import {launchImageLibrary} from 'react-native-image-picker';
import {openComposer} from 'react-native-email-link';
import {useNavigation} from '@react-navigation/core';

import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import ImageUtils from '../../../utils/image';
import useCreateChat from '../../../hooks/screen/useCreateChat';
import TokenStorage, {ITokenEnum} from '../../../utils/storage/custom/tokenStorage';
import {Context} from '../../../context';
import {checkUserBlock} from '../../../service/profile';
import {
  getChannelListInfo,
  getChatName,
  getOfficialAnonUsername
} from '../../../utils/string/StringUtils';
import {requestExternalStoragePermission} from '../../../utils/permission';
import {setChannel} from '../../../context/actions/setChannel';
import {setParticipants} from '../../../context/actions/groupChat';
import {addMemberGroup, removeMemberGroup} from '../../../service/chat';
import UserSchema from '../../../database/schema/UserSchema';
import ChannelListSchema from '../../../database/schema/ChannelListSchema';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../../../hooks/core/auth/useUserAuthHook';
import useChatUtilsHook from '../../../hooks/core/chat/useChatUtilsHook';

const useGroupInfo = (channelId = null) => {
  const navigation = useNavigation();
  const {localDb, refresh} = useLocalDatabaseHook();

  const [groupChatState, groupPatchDispatch] = React.useContext(Context).groupChat;
  const [, dispatchChannel] = React.useContext(Context).channel;
  const [client] = React.useContext(Context).client;
  const [channelState] = React.useContext(Context).channel;
  const [profile] = React.useContext(Context).profile;

  const blockModalRef = React.useRef(null);

  const [isLoadingMembers, setIsLoadingMembers] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState('');
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [isLoadingInitChat, setIsLoadingInitChat] = React.useState(false);
  const [username, setUsername] = React.useState(channelState.channel?.data?.name);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [newParticipant, setNewParticipant] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [isAnonymousModalOpen, setIsAnonymousModalOpen] = React.useState(false);
  const [isFetchingAllowAnonDM, setIsFetchingAllowAnonDM] = React.useState(false);

  const {createSignChat, handleAnonymousMessage} = useCreateChat();
  const {setSelectedChannel} = useChatUtilsHook();
  const {anonProfileId, signedProfileId} = useUserAuthHook();

  const {participants, asset} = groupChatState;
  const countUser = Object.entries(participants).length;
  const {channel, profileChannel} = channelState;
  const createChat = channelState.channel?.data?.created_at;
  const anonUserEmojiName = channelState?.channel?.data?.anon_user_info_emoji_name;
  const anonUserColorName = channelState?.channel?.data?.anon_user_info_color_name;

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
      setNewParticipant(result.members);
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
    if (anonUserEmojiName) return `${anonUserColorName} ${anonUserEmojiName}`;
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
      setIsLoadingInitChat(true);
      const sendData = {
        user_id: selectedUser.user_id || selectedUser?.userId
      };
      const members = [];
      members.push(profile?.myProfile?.user_id, selectedUser?.user_id || selectedUser?.userId);
      const processGetBlock = await checkUserBlock(sendData);
      if (!processGetBlock.data.data.blocked && !processGetBlock.data.data.blocker) {
        return createSignChat(members, selectedUser);
      }
      return handleOpenProfile(selectedUser);
    } catch (e) {
      console.log('error:', e);
    } finally {
      setIsLoadingInitChat(false);
    }
  };

  const handleOnImageClicked = () => {
    launchGallery();
  };

  const uploadImage = async (pathImg) => {
    try {
      setIsUploadingImage(true);
      const result = await ImageUtils.uploadImage(pathImg);
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
            uploadImage(res?.assets?.[0]?.uri);
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
    setNewParticipant(newData);
  };

  const handleSelectUser = async (user) => {
    const userId = user.user_id || user.userId;
    if (userId === profile.myProfile.user_id) return;
    const defaultUserData = {...user};
    defaultUserData.allow_anon_dm = false;
    try {
      setIsFetchingAllowAnonDM(true);
      await AnonymousMessageRepo.checkIsTargetAllowingAnonDM(userId);
      defaultUserData.allow_anon_dm = true;
    } catch (e) {
      console.log(e);
    } finally {
      setSelectedUser(defaultUserData);
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
    const responseChannelData = await removeMemberGroup({
      channelId,
      targetUserId: selectedUser?.userId
    });

    try {
      const {channelName} = getChannelListInfo(
        responseChannelData.data,
        signedProfileId,
        anonProfileId
      );
      const channelList = await ChannelListSchema.getSchemaById(localDb, channelId);
      channelList.name = channelName;
      await channelList.save(localDb);

      setSelectedChannel(channelList);

      await UserSchema.deleteByUserId(localDb, selectedUser?.userId, channelId);
    } catch (e) {
      console.log('error on memberSchema');
      console.log(JSON.stringify(e));
      console.log(e);
    }

    refresh('channelList');
    refresh('chat');
    refresh('channelInfo');

    setTimeout(() => {
      navigation.navigate('SignedChatScreen');
    }, 500);
  };

  const onAddMember = async (selectedUsers) => {
    const responseChannelData = await addMemberGroup({
      channelId,
      memberIds: selectedUsers.map((user) => user.user_id)
    });

    try {
      const {channelName} = getChannelListInfo(
        responseChannelData.data,
        signedProfileId,
        anonProfileId
      );
      const channelList = await ChannelListSchema.getSchemaById(localDb, channelId);
      channelList.name = channelName;
      await channelList.save(localDb);

      setSelectedChannel(channelList);

      selectedUsers?.forEach(async (member) => {
        const userMember = UserSchema.fromMemberWebsocketObject(
          {
            user: {
              id: member?.user_id,
              username: member?.username,
              image: member?.profile_pic_path,
              last_active: member?.last_active_at,
              created_at: member?.created_at,
              updated_at: member?.updated_at
            },
            banner: member?.is_banner
          },
          channelId
        );
        await userMember.saveOrUpdateIfExists(localDb);
      });
    } catch (e) {
      console.log('error on memberSchema');
      console.log(JSON.stringify(e));
      console.log(e);
    }

    refresh('channelList');
    refresh('chat');
    refresh('channelInfo');

    setTimeout(() => {
      navigation.navigate('SignedChatScreen');
    }, 500);
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
    setOpenModal(false);
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
          name: selectedUser?.user?.name || selectedUser?.user?.username,
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
      const blockedUsername = selectedUser?.user?.anon_user_info_color_name
        ? getOfficialAnonUsername(selectedUser?.user)
        : selectedUser?.user?.anonymousUsername || selectedUser?.user?.username;

      setIsAnonymousModalOpen(false);
      const blockComponentValue = {
        postId: null,
        isAnonymousUserFromGroupInfo: true,
        actor: {
          id: selectedUser?.user?.id || selectedUser?.userId,
          data: {
            username: blockedUsername
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
    try {
      setIsLoadingInitChat(true);
      await handleAnonymousMessage(selectedUser, channelId, 'chat');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInitChat(false);
      setOpenModal(false);
    }
  };

  const handleOpenProfile = async (item) => {
    setOpenModal(false);
    setTimeout(() => {
      if (profile?.myProfile?.user_id === item?.user_id) {
        return null;
      }

      return navigation.push('OtherProfile', {
        data: {
          user_id: profile.myProfile.user_id,
          other_id: item?.user_id || item?.userId,
          username: item?.user?.name || item?.user?.username || item.username
        }
      });
    }, 100);
  };

  /**
   *
   * @param {('view' | 'remove' | 'message' | 'block' | 'message-anonymously')} status
   */
  const handleOpenPopup = async (status) => {
    console.warn('selectedUser', JSON.stringify(selectedUser));
    if (status === 'view') {
      setOpenModal(false);
      handleOpenProfile(selectedUser).catch((e) => console.log(e));
    }
    if (status === 'remove') {
      Alert.alert(
        null,
        `Are you sure you want to remove ${selectedUser?.username} from this group? We will let the group know that you removed ${selectedUser?.username}.`,
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
      await handleMessageAnonymously();
    }
  };
  const onLeaveGroup = () => {
    Alert.alert('', 'Exit this group?', [{text: 'Cancel'}, {text: 'Exit', onPress: leaveGroup}]);
  };

  const leaveGroup = async () => {
    try {
      const response = await channel.removeMembers([profile.myProfile.user_id]);
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
      setNewParticipant(response.members);
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
    const isAnonymousUser = Boolean(item?.user?.anon_user_info_emoji_name);
    if (item?.user_id === profile?.myProfile?.user_id) return;

    if (isAnonymousUser) {
      const modifiedUser = {...item};
      modifiedUser.user.anonymousUsername = `${item?.user?.anon_user_info_color_name} ${item?.user?.anon_user_info_emoji_name}`;
      setSelectedUser(modifiedUser);
      setIsAnonymousModalOpen(true);
      return;
    }

    await handleSelectUser(item);
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
    uploadImage,
    chatName,
    launchGallery,
    selectedUser,
    handleSelectUser,
    initParticipant,
    newParticipant,
    handleCloseSelectUser,
    onRemoveUser,
    onAddMember,
    openModal,
    leaveGroup,
    handleOpenPopup,
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
    setNewParticipant,
    isAnonymousModalOpen,
    setIsAnonymousModalOpen,
    blockModalRef,
    isFetchingAllowAnonDM,
    isLoadingInitChat
  };
};

export default useGroupInfo;
