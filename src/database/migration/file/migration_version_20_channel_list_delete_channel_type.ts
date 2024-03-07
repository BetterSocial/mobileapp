import BaseMigrationV2 from './base_migration_v2';
import ChannelList from '../../schema/ChannelListSchema';

class MigrationVersion20 extends BaseMigrationV2 {
  _migrationVersion = 20;

  _tableName = ChannelList.getTableName();

  upQuery(): string {
    return `ALTER TABLE ${this._tableName}  DROP COLUMN channel_type`;
  }

  downQuery(): string {
    return `ALTER TABLE ${this._tableName} ADD COLUMN channel_type TEXT NOT NULL CHECK(channel_type IN ('PM', 'ANON_PM', 'GROUP', 'ANON_GROUP', 'TOPIC', 'POST_NOTIFICATION', 'ANON_POST_NOTIFICATION', 'FOLLOW'))`;
  }
}

export default new MigrationVersion20();
