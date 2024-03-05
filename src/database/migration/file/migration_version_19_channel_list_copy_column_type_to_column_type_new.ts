import BaseMigrationV2 from './base_migration_v2';
import ChannelList from '../../schema/ChannelListSchema';

class MigrationVersion19 extends BaseMigrationV2 {
  _migrationVersion = 19;

  _tableName = ChannelList.getTableName();

  upQuery(): string {
    return `UPDATE ${this._tableName} SET channel_type_new = channel_type`;
  }

  // eslint-disable-next-line class-methods-use-this
  downQuery() {
    return '';
  }
}

export default new MigrationVersion19();
