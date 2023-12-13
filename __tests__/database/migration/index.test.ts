import {DROP_ALL_DB, TARGET_MIGRATION_VERSION} from '../../../src/database/migration';

describe('TESTING migration file', () => {
  it('TEST should check DROP_ALL_DB to false', () => {
    expect(DROP_ALL_DB).toBeFalsy();
  });

  it('TEST should check TARGET_MIGRATION_VERSION to 8', () => {
    expect(TARGET_MIGRATION_VERSION).toBe(8);
  });
});
