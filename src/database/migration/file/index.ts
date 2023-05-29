import Migration from './migration.types';
import MigrationVersion0 from './migration_version_0';
import MigrationVersion1 from './migration_version_1';
import MigrationVersion2 from './migration_version_2';
import MigrationVersion3 from './migration_version_3';

const allMigrations:Migration[] = [
    MigrationVersion0, 
    MigrationVersion1, 
    MigrationVersion2, 
    MigrationVersion3
];

export default allMigrations;
