import {atom} from 'recoil';

type CurrentChatScreenType = 'SignedChatScreen' | 'AnonymousChatScreen';

const currentChatScreenAtom = atom<CurrentChatScreenType | null>({
  key: 'currentChatScreenAtom',
  default: null
});

export default currentChatScreenAtom;
