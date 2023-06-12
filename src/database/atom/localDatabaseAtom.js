const {atom} = require('recoil');

const localDatabaseAtom = atom({
  key: 'localDatabaseAtom',
  default: null
});

export default localDatabaseAtom;
