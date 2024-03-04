import BaseMigrationV2 from './base_migration_v2';
import ChannelList from '../../schema/ChannelListSchema';

class MigrationVersion18 extends BaseMigrationV2 {
  _migrationVersion = 18;

  _tableName = ChannelList.getTableName();

  upQuery(): string {
    return `ALTER TABLE ${this._tableName} ADD COLUMN channel_type_new TEXT NOT NULL DEFAULT ''`;
  }

  downQuery() {
    return `ALTER TABLE ${this._tableName} DROP COLUMN channel_type_new`;
  }
}

export default new MigrationVersion18();
