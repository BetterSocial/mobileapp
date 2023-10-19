import {atom} from 'recoil';

type MigrationDbStatus = 'MIGRATED' | 'NOT_MIGRATED';

const migrationDbStatusAtom = atom<MigrationDbStatus>({
  key: 'migrationDbStatusAtom',
  default: 'NOT_MIGRATED'
});

export default migrationDbStatusAtom;
