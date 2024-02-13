import * as React from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseAnonymousChatInfoScreenHook from '../../../types/hooks/screens/useAnonymousChatInfoScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useGroupInfo from '../../screens/GroupInfo/hooks/useGroupInfo';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../core/auth/useUserAuthHook';
import {ChannelListMemberSchema} from '../../../types/database/schema/ChannelList.types';
import {Context} from '../../context';
import {Member} from '../../../types/database/schema/ChatListDetail.types';
import {SIGNED} from '../core/constant';
import {isContainUrl} from '../../utils/Utils';

function useChatInfoScreenHook(): UseAnonymousChatInfoScreenHook {
  const {params}: any = useRoute();
  const {
    handlePressContact,
    openModal,
    handleCloseSelectUser,
    alertRemoveUser,
    isAnonymousModalOpen,
    selectedUser,
    blockModalRef,
    isLoadingInitChat
  } = useGroupInfo();
  const {localDb} = useLocalDatabaseHook();
  const [loadingChannelInfo, setLoadingChannelInfo] = React.useState<boolean>(false);
  const {isLoadingFetchingChannelDetail, selectedChannel, goBack} = useChatUtilsHook();
  const [myUserId] = React.useContext(Context).profile;
  const navigation = useNavigation();
  const [showPopupBlock, setShowPopupBlock] = React.useState(false);
  const [channelInfo, setChannelInfo] = React.useState(null);
  const {signedProfileId, anonProfileId} = useUserAuthHook();

  const initChatInfoData = async () => {
    if (localDb) {
      setLoadingChannelInfo(true);

      const data = await ChannelList.getChannelInfo(
        localDb,
        selectedChannel?.id,
        signedProfileId,
        anonProfileId
      );

      setChannelInfo(data);
      setLoadingChannelInfo(false);
    }
  };

  const onContactPressed = (item: ChannelListMemberSchema) => {
    if (params.from === SIGNED) {
      return handlePressContact(item);
    }

    return navigation.push('OtherProfile', {
      data: {
        user_id: myUserId?.myProfile?.user_id,
        other_id: item?.user_id || item?.userId,
        username: item?.user?.name || item?.user?.username
      }
    });
  };

  const handleClosePopup = () => setShowPopupBlock(false);

  const isAnonymousUser = (item) => {
    if (!item.user.image || !isContainUrl(item.user.image)) {
      return true;
    }
    return false;
  };

  const handlePressPopup = (status) => {
    alertRemoveUser(status);
  };

  const handleShowArrow = (item: Member) => {
    if (params?.from === SIGNED) {
      return item?.user?.userId !== signedProfileId;
    }

    if (!isContainUrl(item?.user?.profilePicture) || item?.user?.anon_user_info_emoji_name) {
      return false;
    }

    return item?.user_id !== myUserId?.myProfile?.user_id;
  };

  const goToEditGroup = () => {
    navigation?.navigate('GroupSetting', selectedChannel);
  };

  React.useEffect(() => {
    initChatInfoData();
  }, []);

  return {
    isLoadingFetchingChannelDetail,
    channelInfo,
    goBack,
    onContactPressed,
    selectedUser,
    showPopupBlock,
    handleClosePopup,
    isAnonymousUser,
    handlePressPopup,
    openModal,
    handleCloseSelectUser,
    isAnonymousModalOpen,
    blockModalRef,
    handleShowArrow,
    goToEditGroup,
    loadingChannelInfo,
    isLoadingInitChat
  };
}

export default useChatInfoScreenHook;
