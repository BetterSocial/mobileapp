import * as React from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseAnonymousChatInfoScreenHook from '../../../types/hooks/screens/useAnonymousChatInfoScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {ChannelListMemberSchema} from '../../../types/database/schema/ChannelList.types';
import {getAnonymousUserId, getUserId} from '../../utils/users';
import {Context} from '../../context';
import {SIGNED} from '../core/constant';
import {isContainUrl} from '../../utils/Utils';
import useGroupInfo from '../../screens/GroupInfo/hooks/useGroupInfo';
import {Member} from '../../../types/database/schema/ChatListDetail.types';

// import {} from '../../'
function useChatInfoScreenHook(): UseAnonymousChatInfoScreenHook {
  const {params}: any = useRoute();
  const {
    handlePressContact,
    openModal,
    handleCloseSelectUser,
    alertRemoveUser,
    isAnonymousModalOpen,
    selectedUser,
    blockModalRef
  } = useGroupInfo();
  const {localDb, channelList} = useLocalDatabaseHook();
  const {selectedChannel, goBack} = useChatUtilsHook();
  const [myUserId] = React.useContext(Context).profile;
  const navigation = useNavigation();
  const [showPopupBlock, setShowPopupBlock] = React.useState(false);
  const [channelInfo, setChannelInfo] = React.useState(null);
  const initChatInfoData = async () => {
    if (!localDb) return;
    const myId = await getUserId();
    const myAnonymousId = await getAnonymousUserId();
    const data = await ChannelList.getChannelInfo(
      localDb,
      selectedChannel?.id,
      myId,
      myAnonymousId
    );
    setChannelInfo(data);
  };

  const onContactPressed = (item: ChannelListMemberSchema) => {
    if (params.from === SIGNED) {
      return handlePressContact(item);
    }
    return navigation.push('OtherProfile', {
      data: {
        user_id: myUserId?.myProfile?.user_id,
        other_id: item?.user_id,
        username: item?.user?.name
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
      return item?.user_id !== myUserId?.myProfile?.user_id;
    }
    if (!isContainUrl(item?.user?.image)) {
      return false;
    }
    return item?.user_id !== myUserId?.myProfile?.user_id;
  };

  const goToEditGroup = () => {
    console.log('masuk', {selectedChannel});
    navigation?.navigate('GroupSetting', selectedChannel);
  };

  React.useEffect(() => {
    initChatInfoData();
  }, [localDb, channelList]);

  return {
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
    goToEditGroup
  };
}

export default useChatInfoScreenHook;
