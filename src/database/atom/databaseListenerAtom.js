import {atom} from 'recoil';

const databaseListenerAtom = atom({
  key: 'databaseListenerAtom',
  default: {
    channelList: 0,
    channelInfo: 0,
    chat: 0,
    user: 0,
    channelMember: 0
  }
});

export default databaseListenerAtom;
