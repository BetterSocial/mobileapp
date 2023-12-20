import Migration from './migration.types';
import MigrationVersion0 from './migration_version_0';
import MigrationVersion1 from './migration_version_1';
import MigrationVersion2 from './migration_version_2';
import MigrationVersion3 from './migration_version_3';
import MigrationVersion4 from './migration_version_4';
import MigrationVersion5 from './migration_version_5';
import MigrationVersion6 from './migration_version_6';
import MigrationVersion7 from './migration_version_7';
import MigrationVersion8 from './migration_version_8';

const allMigrations: Migration[] = [
  MigrationVersion0,
  MigrationVersion1,
  MigrationVersion2,
  MigrationVersion3,
  MigrationVersion4,
  MigrationVersion5,
  MigrationVersion6,
  MigrationVersion7,
  MigrationVersion8
];

export default allMigrations;
