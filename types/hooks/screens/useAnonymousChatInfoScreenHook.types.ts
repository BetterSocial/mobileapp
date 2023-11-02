import {ChannelList, ChannelListMemberSchema} from '../../database/schema/ChannelList.types';

interface UseAnonymousChatInfoScreenHook {
  channelInfo: ChannelList;
  goBack: () => void;
  onContactPressed: (item: ChannelListMemberSchema) => void;
  isAnonymous: boolean;
  selectedUser: ChannelListMemberSchema;
  showPopupBlock: boolean;
  handleClosePopup: () => void;
  isAnonymousUser: (item: any) => void;
  handlePressPopup: (status: string) => void;
  handleCloseSelectUser: () => void;
  openModal: boolean;
  isAnonymousModalOpen: boolean;
  blockModalRef: () => void;
}

export default UseAnonymousChatInfoScreenHook;
