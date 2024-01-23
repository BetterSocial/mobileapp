import allMigrations from '../../../../src/database/migration/file';

describe('TESTING all migration file', () => {
  it('TEST number of migration registered', async () => {
    // Setup

    // Execution

    // Assertion
    expect(allMigrations.length).toEqual(17);
  });
});
