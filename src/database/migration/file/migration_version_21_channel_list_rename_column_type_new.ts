import BaseMigrationV2 from './base_migration_v2';
import ChannelList from '../../schema/ChannelListSchema';

class MigrationVersion21 extends BaseMigrationV2 {
  _migrationVersion = 21;

  _tableName = ChannelList.getTableName();

  upQuery(): string {
    return `ALTER TABLE ${this._tableName} RENAME COLUMN channel_type_new TO channel_type`;
  }

  downQuery(): string {
    return `ALTER TABLE ${this._tableName} RENAME COLUMN channel_type TO channel_type_new`;
  }
}

export default new MigrationVersion21();
