import * as React from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';

import ChannelList from '../../database/schema/ChannelListSchema';
import useAnalyticUtilsHook from '../../libraries/analytics/useAnalyticUtilsHook';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useGroupInfo from '../../screens/GroupInfo/hooks/useGroupInfo';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../core/auth/useUserAuthHook';
import UseAnonymousChatInfoScreenHook, {
  ChatInfoModalActions
} from '../../../types/hooks/screens/useAnonymousChatInfoScreenHook.types';
import {ANONYMOUS, SIGNED} from '../core/constant';
import {BetterSocialEventTracking} from '../../libraries/analytics/analyticsEventTracking';
import {ChannelListMemberSchema} from '../../../types/database/schema/ChannelList.types';
import {Context} from '../../context';
import {Member} from '../../../types/database/schema/ChatListDetail.types';
import {isContainUrl} from '../../utils/Utils';

function useChatInfoScreenHook(): UseAnonymousChatInfoScreenHook {
  const {params}: any = useRoute();
  const navigation = useNavigation();

  const [myUserId] = React.useContext(Context).profile;

  const [showPopupBlock, setShowPopupBlock] = React.useState(false);
  const [channelInfo, setChannelInfo] = React.useState<ChannelList | null>(null);
  const [loadingChannelInfo, setLoadingChannelInfo] = React.useState<boolean>(false);

  const channelType = channelInfo?.channelType;
  const {eventTrackByChannelType} = useAnalyticUtilsHook('SIGNED', channelType);

  const {isLoadingFetchingChannelDetail, selectedChannel, goBack} = useChatUtilsHook();
  const {
    handlePressContact,
    openModal,
    handleCloseSelectUser,
    handleOpenPopup,
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
    handlePressContact(item);

    return eventTrackByChannelType({
      signed: BetterSocialEventTracking.SIGNED_CHAT_DETAIL_OPEN_PARTICIPANT_MENU,
      anon: BetterSocialEventTracking.ANONYMOUS_CHAT_DETAIL_OPEN_PARTICIPANT_MENU,
      group: BetterSocialEventTracking.GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU
    });
  };

  const handleClosePopup = () => setShowPopupBlock(false);

  const isAnonymousUser = (item) => {
    if (!item.user.image || !isContainUrl(item.user.image)) {
      return true;
    }
    return false;
  };

  const handlePressPopup = (status: ChatInfoModalActions) => {
    if (status === 'view') {
      eventTrackByChannelType({
        signed:
          BetterSocialEventTracking.SIGNED_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_VIEW_OTHER_PROFILE,
        anon: BetterSocialEventTracking.ANONYMOUS_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_VIEW_OTHER_PROFILE,
        group: BetterSocialEventTracking.GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_VIEW_OTHER_PROFILE
      });
    } else if (status === 'message') {
      eventTrackByChannelType({
        anon: BetterSocialEventTracking.ANONYMOUS_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_LEAVE_INCOGNITO_MODE,
        group: BetterSocialEventTracking.GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_VIEW_MESSAGE
      });
    } else if (status === 'message-anonymously') {
      eventTrackByChannelType({
        signed: BetterSocialEventTracking.SIGNED_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_GO_INCOGNITO,
        group:
          BetterSocialEventTracking.GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_VIEW_MESSAGE_INCOGNITO
      });
    } else if (status === 'remove') {
      eventTrackByChannelType({
        group:
          BetterSocialEventTracking.GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_REMOVE_USER_BUTTON_CLICKED
      });
    }

    handleOpenPopup(status);
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

  const goBackAndSendAnalytics = () => {
    eventTrackByChannelType({
      signed: BetterSocialEventTracking.SIGNED_CHAT_DETAIL_BACK_BUTTON_PRESSED,
      anon: BetterSocialEventTracking.ANONYMOUS_CHAT_DETAIL_BACK_BUTTON_PRESSED,
      group: BetterSocialEventTracking.GROUP_CHAT_DETAIL_BACK_BUTTON_PRESSED
    });

    goBack();
  };

  React.useEffect(() => {
    initChatInfoData();
  }, []);

  return {
    isLoadingFetchingChannelDetail,
    channelInfo,
    eventTrackByChannelType,
    goBack: goBackAndSendAnalytics,
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
