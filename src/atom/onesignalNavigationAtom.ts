import {atom} from 'recoil';

const onesignalNavigationAtom = atom({
  key: 'onesignalNavigationAtom',
  default: {
    screen: null,
    params: null
  }
});

export default onesignalNavigationAtom;
