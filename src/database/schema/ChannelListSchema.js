class ChannelList {
  constructor({
    id,
    channel_picture,
    name,
    description,
    unread_count = 0,
    channel_type,
    last_updated_at,
    created_at
  }) {
    if (!id) throw new Error('ChannelList must have an id');

    this.id = id;
    this.channel_picture = channel_picture;
    this.name = name;
    this.description = description;
    this.unread_count = unread_count;
    this.channel_type = channel_type;
    this.last_updated_at = last_updated_at;
    this.created_at = created_at;
  }

  save(db) {
    return db.executeSql(
      `INSERT OR REPLACE INTO ${ChannelList.getTableName()} (
        id,
        channel_picture,
        name,
        description,
        unread_count,
        channel_type,
        last_updated_at,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.id,
        this.channel_picture,
        this.name,
        this.description,
        this.unread_count,
        this.channel_type,
        this.last_updated_at,
        this.created_at
      ]
    );
  }

  static async getAll(db) {
    const [results] = await db.executeSql(`SELECT * FROM ${ChannelList.getTableName()}`);
    return results.rows.raw().map(ChannelList.fromDatabaseObject);
  }

  static getTableName() {
    return 'channel_lists';
  }

  static fromWebsocketObject(json) {
    return new ChannelList({
      id: json?.channel?.id,
      channel_picture: '',
      name: json?.channel?.name,
      description: json?.message?.message,
      unread_count: json.unread_count,
      channel_type: 'ANON_PM',
      last_updated_at: json.last_message_at,
      created_at: json.created_at
    });
  }

  static fromDatabaseObject(json) {
    return new ChannelList({
      id: json.id,
      channel_picture: json.channel_picture,
      name: json.name,
      description: json.description,
      unread_count: json.unread_count,
      channel_type: json.channel_type,
      last_updated_at: json.last_updated_at,
      created_at: json.created_at
    });
  }
}

export default ChannelList;
