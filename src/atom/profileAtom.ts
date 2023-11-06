import {atom} from 'recoil';

const profileAtom = atom({
  key: 'profileAtom',
  default: {
    signedProfileId: null,
    anonProfileId: null,
    token: null,
    anonymousToken: null
  }
});

export default profileAtom;
