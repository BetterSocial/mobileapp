import {DROP_ALL_DB, TARGET_MIGRATION_VERSION} from '../../../src/database/migration';

describe('TESTING migration file', () => {
  it('TEST should check DROP_ALL_DB to false', () => {
    expect(DROP_ALL_DB).toBeFalsy();
  });

  it('TEST should expect TARGET_MIGRATION_VERSION to be 17', () => {
    expect(TARGET_MIGRATION_VERSION).toBe(17);
  });
});
