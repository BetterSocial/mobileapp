import BaseMigrationV2 from './base_migration_v2';
import ChannelList from '../../schema/ChannelListSchema';

class MigrationVersion22 extends BaseMigrationV2 {
  _migrationVersion = 22;

  _tableName = ChannelList.getTableName();

  upQuery(): string {
    return `ALTER TABLE ${this._tableName} ADD COLUMN topic_post_expired_at DATETIME DEFAULT NULL`;
  }

  downQuery(): string {
    return `ALTER TABLE ${this._tableName} DROP COLUMN topic_post_expired_at`;
  }
}

export default new MigrationVersion22();
