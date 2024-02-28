import {useNavigation, useRoute} from '@react-navigation/core';
import * as React from 'react';

import {ChannelListMemberSchema} from '../../../types/database/schema/ChannelList.types';
import {Member} from '../../../types/database/schema/ChatListDetail.types';
import UseAnonymousChatInfoScreenHook from '../../../types/hooks/screens/useAnonymousChatInfoScreenHook.types';
import {Context} from '../../context';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import ChannelList from '../../database/schema/ChannelListSchema';
import useGroupInfo from '../../screens/GroupInfo/hooks/useGroupInfo';
import {isContainUrl} from '../../utils/Utils';
import useUserAuthHook from '../core/auth/useUserAuthHook';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import {ANONYMOUS, SIGNED} from '../core/constant';

function useChatInfoScreenHook(): UseAnonymousChatInfoScreenHook {
  const {params}: any = useRoute();
  const navigation = useNavigation();

  const [myUserId] = React.useContext(Context).profile;

  const [showPopupBlock, setShowPopupBlock] = React.useState(false);
  const [channelInfo, setChannelInfo] = React.useState(null);
  const [loadingChannelInfo, setLoadingChannelInfo] = React.useState<boolean>(false);

  const {isLoadingFetchingChannelDetail, selectedChannel, goBack} = useChatUtilsHook();
  const {
    handlePressContact,
    openModal,
    handleCloseSelectUser,
    alertRemoveUser,
    isAnonymousModalOpen,
    selectedUser,
    blockModalRef,
    isLoadingInitChat
  } = useGroupInfo(selectedChannel?.id);

  const {signedProfileId, anonProfileId} = useUserAuthHook();
  const {localDb} = useLocalDatabaseHook();

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
    return handlePressContact(item);
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
    if (params?.from === SIGNED || params?.from === ANONYMOUS) {
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
