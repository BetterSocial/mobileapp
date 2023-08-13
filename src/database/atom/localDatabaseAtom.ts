import {atom} from 'recoil';

const localDatabaseAtom = atom({
  key: 'localDatabaseAtom',
  default: null
});

export default localDatabaseAtom;
