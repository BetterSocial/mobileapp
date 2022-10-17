import {atom} from 'recoil';

const clientAtom = atom({
  key: "clientAtom",
  default: {
    client: null
  },
  effects_UNSTABLE: [
    () => {

    }
  ]
})
