import {ChannelList, ChannelListMemberSchema} from '../../database/schema/ChannelList.types';
import {ChannelTypeEventTracking} from '../../../src/libraries/analytics/useAnalyticUtilsHook';
import {Member} from '../../database/schema/ChatListDetail.types';

export type ChatInfoModalActions = 'message' | 'view' | 'message-anonymously' | 'remove' | 'block';
interface UseAnonymousChatInfoScreenHook {
  isLoadingFetchingChannelDetail: boolean;
  channelInfo: ChannelList;
  goBack: () => void;
  onContactPressed: (item: ChannelListMemberSchema, from?: string) => void;
  eventTrackByChannelType: (options: ChannelTypeEventTracking) => void;
  isAnonymous: boolean;
  selectedUser: ChannelListMemberSchema;
  showPopupBlock: boolean;
  handleClosePopup: () => void;
  isAnonymousUser: (item: any) => boolean;
  handlePressPopup: (status: string) => void;
  handleCloseSelectUser: () => void;
  openModal: boolean;
  isAnonymousModalOpen: boolean;
  blockModalRef: () => void;
  handleShowArrow: (item: Member) => void;
  goToEditGroup: () => void;
  loadingChannelInfo: boolean;
  isLoadingInitChat: boolean;
}

export default UseAnonymousChatInfoScreenHook;
