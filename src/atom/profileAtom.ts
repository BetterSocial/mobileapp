import {atom} from 'recoil';

const profileAtom = atom({
  key: 'profileAtom',
  default: {
    signedProfileId: null,
    anonProfileId: null
  }
});

export default profileAtom;
