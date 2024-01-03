import Migration from './migration.types';
import MigrationVersion0 from './migration_version_0';
import MigrationVersion1 from './migration_version_1';
import MigrationVersion10 from './migration_version_10_users_add_anon_user_info_color_name';
import MigrationVersion11 from './migration_version_11_users_add_anon_user_info_color_code';
import MigrationVersion12 from './migration_version_12_channel_lists_add_anon_user_info_emoji_name';
import MigrationVersion13 from './migration_version_13_channel_lists_add_anon_user_info_emoji_code';
import MigrationVersion14 from './migration_version_14_channel_lists_add_anon_user_info_color_name';
import MigrationVersion15 from './migration_version_15_channel_lists_add_anon_user_info_color_code';
import MigrationVersion2 from './migration_version_2';
import MigrationVersion3 from './migration_version_3';
import MigrationVersion4 from './migration_version_4';
import MigrationVersion5 from './migration_version_5';
import MigrationVersion6 from './migration_version_6';
import MigrationVersion7 from './migration_version_7';
import MigrationVersion8 from './migration_version_8_users_add_anon_user_info_emoji_name';
import MigrationVersion9 from './migration_version_9_users_add_anon_user_info_emoji_code';

const allMigrations: Migration[] = [
  MigrationVersion0,
  MigrationVersion1,
  MigrationVersion2,
  MigrationVersion3,
  MigrationVersion4,
  MigrationVersion5,
  MigrationVersion6,
  MigrationVersion7,
  MigrationVersion8,
  MigrationVersion9,
  MigrationVersion10,
  MigrationVersion11,
  MigrationVersion12,
  MigrationVersion13,
  MigrationVersion14,
  MigrationVersion15
];

export default allMigrations;
