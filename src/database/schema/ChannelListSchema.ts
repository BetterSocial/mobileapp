import BaseDbSchema from './BaseDbSchema';

class ChannelList implements BaseDbSchema {
  id: string;
  channel_picture: string;
  name: string;
  description: string;
  unread_count: number;
  channel_type: string;
  last_updated_at: string;
  created_at: string;
  raw_json: any;

  constructor({
    id,
    channel_picture,
    name,
    description,
    unread_count = 0,
    channel_type,
    last_updated_at,
    created_at,
    raw_json
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
    this.raw_json = raw_json;
  }
  getAll(db: any): Promise<BaseDbSchema[]> {
    throw new Error('Method not implemented.');
  }
  getTableName(): string {
    throw new Error('Method not implemented.');
  }
  fromDatabaseObject(dbObject: any): BaseDbSchema {
    throw new Error('Method not implemented.');
  }

  save(db) {
    let jsonString:string | null = null;

    try {
      jsonString = JSON.stringify(this.raw_json);
    } catch (e) {
      console.log(e);
    }
    return db.executeSql(
      `INSERT OR REPLACE INTO ${ChannelList.getTableName()} (
        id,
        channel_picture,
        name,
        description,
        unread_count,
        channel_type,
        last_updated_at,
        created_at,
        raw_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.id,
        this.channel_picture,
        this.name,
        this.description,
        this.unread_count,
        this.channel_type,
        this.last_updated_at,
        this.created_at,
        jsonString
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
      created_at: json.created_at,
      raw_json: json
    });
  }

  static fromDatabaseObject(json) {
    let jsonParsed = null;
    try {
      jsonParsed = JSON.parse(json.raw_json);
    } catch (e) {
      console.log(e);
    }
    return new ChannelList({
      id: json.id,
      channel_picture: json.channel_picture,
      name: json.name,
      description: json.description,
      unread_count: json.unread_count,
      channel_type: json.channel_type,
      last_updated_at: json.last_updated_at,
      created_at: json.created_at,
      raw_json: jsonParsed
    });
  }

  static fromPostNotifObject(json) {
    return new ChannelList({
      id: json?.new?.id,
      channel_picture: '',
      name: '',
      description: json?.new?.message,
      unread_count: 1,
      channel_type: 'ANON_POST_NOTIFICATION',
      last_updated_at: json?.new?.time,
      created_at: json?.new?.time,
      raw_json: json
    });
  }
}

export default ChannelList;
