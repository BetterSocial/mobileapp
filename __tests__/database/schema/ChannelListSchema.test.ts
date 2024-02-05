import ChannelList from '../../../src/database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../../src/database/schema/ChannelListMemberSchema';
import UserSchema from '../../../src/database/schema/UserSchema';
import {consoleSpy} from '../../../__utils__/spy';
import {mockDb, mockDbExecuteSql} from '../../../__utils__/mockedVariable/mockDb';

let channelListSchema;

const savePrepReplacementExpectation = [
  'id',
  'channelPicture',
  'name',
  'description',
  0,
  'channelType',
  'lastUpdatedAt',
  'lastUpdatedBy',
  'createdAt',
  'expiredAt',
  '{}',
  null,
  null,
  null,
  null
];

const fromDatabaseObjectExpectation = {
  id: 'id',
  channelPicture: 'channelPicture',
  name: 'name',
  description: 'description',
  unreadCount: 0,
  channelType: 'channelType',
  lastUpdatedAt: 'lastUpdatedAt',
  lastUpdatedBy: 'lastUpdatedBy',
  createdAt: 'createdAt',
  rawJson: {},
  members: [],
  expiredAt: 'expiredAt'
};

beforeEach(() => {
  jest.clearAllMocks();
  channelListSchema = new ChannelList({
    id: 'id',
    channelPicture: 'channelPicture',
    lastUpdatedAt: 'lastUpdatedAt',
    lastUpdatedBy: 'lastUpdatedBy',
    name: 'name',
    rawJson: {},
    user: null,
    expiredAt: 'expiredAt',
    members: [],
    unreadCount: 0,
    description: 'description',
    createdAt: 'createdAt',
    channelType: 'channelType',
    anon_user_info_color_code: null,
    anon_user_info_color_name: null,
    anon_user_info_emoji_code: null,
    anon_user_info_emoji_name: null
  });
});

describe('TESTING ChannelListSchema', () => {
  describe('TESTING unimplemented function', () => {
    it('TEST getAll should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => channelListSchema.getAll(mockDb)).toThrow('Method not implemented');
    });

    it('TEST getTableNaame should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => channelListSchema.getTableName()).toThrow('Method not implemented');
    });

    it('TEST fromDatabaseObject should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => channelListSchema.fromDatabaseObject({})).toThrow('Method not implemented');
    });
  });

  describe('TESTING static getTableName function', () => {
    it('TEST should return table name', () => {
      expect(ChannelList.getTableName()).toBe('channel_lists');
    });
  });

  describe('TESTING static getAll function', () => {
    it('TEST getAll should return array of UserSchema', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            raw: () => [
              {
                id: 'id',
                channel_picture: 'channelPicture',
                name: 'name',
                description: 'description',
                unread_count: 0,
                channel_type: 'channelType',
                expired_at: 'expiredAt',
                last_updated_at: 'lastUpdatedAt',
                last_updated_by: 'lastUpdatedBy',
                created_at: 'createdAt',
                raw_json: '{}',
                user: null,
                is_me: false
              }
            ]
          }
        }
      ]);

      // Execution
      const result = await ChannelList.getAll(mockDb, 'myId', 'myAnonymousId');

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String), ['myId', 'myAnonymousId']);
      expect(result).toEqual([expect.objectContaining(fromDatabaseObjectExpectation)]);
    });
  });

  describe('TESTING static clearAll function', () => {
    it('TEST should clear all data', async () => {
      // Setup

      // Execution
      await ChannelList.clearAll(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith('DELETE FROM channel_lists');
    });
  });

  describe('TESTING static getById function', () => {
    it('TEST should return ChannelListSchema if row exists', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            length: 1,
            raw: () => [
              {
                id: 'id',
                channel_picture: 'channelPicture',
                name: 'name',
                description: 'description',
                unread_count: 0,
                channel_type: 'channelType',
                expired_at: 'expiredAt',
                last_updated_at: 'lastUpdatedAt',
                last_updated_by: 'lastUpdatedBy',
                created_at: 'createdAt',
                raw_json: '{}',
                user: null,
                is_me: false,
                members: []
              }
            ]
          }
        }
      ]);

      // Execution
      const result = await ChannelList.getById(mockDb, 'id');

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String), ['id']);
      expect(result).not.toBeNull();
    });

    it('TEST should return null if row not exists', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            length: 0,
            raw: () => []
          }
        }
      ]);

      // Execution
      const result = await ChannelList.getById(mockDb, 'id');

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String), ['id']);
      expect(result).toBeNull();
    });
  });

  describe('TESTING static getChannelInfo function', () => {
    it('TEST should return ChannelListSchema if row exists', async () => {
      // Setup
      ChannelList.getById = jest.fn().mockResolvedValueOnce({
        id: 'id',
        channel_picture: 'channelPicture',
        last_updated_at: 'lastUpdatedAt',
        last_updated_by: 'lastUpdatedBy',
        name: 'name',
        raw_json: '{}',
        user: null,
        expired_at: 'expiredAt',
        members: [],
        unread_count: 0,
        description: 'description',
        created_at: 'createdAt',
        channel_type: 'channelType'
      });

      UserSchema.fromDatabaseObject = jest.fn().mockResolvedValueOnce(null);
      UserSchema.getAllByChannelId = jest.fn().mockResolvedValueOnce([]);

      // Execution
      const result = await ChannelList.getChannelInfo(mockDb, 'channelId', 'myId', 'myAnonymousId');

      // Assertion
      expect(ChannelList.getById).toHaveBeenCalledTimes(1);
      expect(ChannelList.getById).toHaveBeenCalledWith(mockDb, 'channelId');
      expect(UserSchema.getAllByChannelId).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.objectContaining(fromDatabaseObjectExpectation));
    });
  });

  describe('TESTING save function', () => {
    it('TEST save without transaction', async () => {
      // Setup

      // Execution
      await channelListSchema.save(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        savePrepReplacementExpectation
      );
    });

    it('TEST save catch error', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => {
        throw new Error('error');
      });

      // Execution
      await channelListSchema.save(mockDb);

      // Assertion
      expect(consoleSpy).toBeCalled();
    });
  });

  describe('TESTING saveAndUpdateIncrementCount function', () => {
    it('TEST should incrementCount', async () => {
      // Setup
      channelListSchema.save = jest.fn();
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            length: 1,
            raw: () => [
              {
                unreadCount: 0
              }
            ]
          }
        }
      ]);

      // Execution
      await channelListSchema.saveAndUpdateIncrementCount(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['id'])
      );
      expect(channelListSchema.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('TESTING saveIfLatest function', () => {
    it('TEST should call save if row not exists', async () => {
      // Setup
      channelListSchema.save = jest.fn();
      ChannelList.getById = jest.fn().mockResolvedValueOnce(null);

      // Execution
      await channelListSchema.saveIfLatest(mockDb);

      // Assertion
      expect(ChannelList.getById).toHaveBeenCalledTimes(1);
      expect(ChannelList.getById).toHaveBeenCalledWith(mockDb, 'id');
      expect(channelListSchema.save).toBeCalled();
    });

    it('TEST should call save if row exists and lastUpdatedAt is greater than existing row', async () => {
      // Setup
      channelListSchema.lastUpdatedAt = '2020-01-02T00:00:00.000Z';
      channelListSchema.save = jest.fn();
      ChannelList.getById = jest.fn().mockResolvedValueOnce({
        last_updated_at: '2020-01-01T00:00:00.000Z'
      });

      // Execution
      await channelListSchema.saveIfLatest(mockDb);

      // Assertion
      expect(ChannelList.getById).toHaveBeenCalledTimes(1);
      expect(ChannelList.getById).toHaveBeenCalledWith(mockDb, 'id');
      expect(channelListSchema.save).toHaveBeenCalledTimes(1);
    });

    it('TEST should not call save if row exists and lastUpdatedAt is less than existing row', async () => {
      // Setup
      channelListSchema.lastUpdatedAt = '2020-01-01T00:00:00.000Z';
      channelListSchema.save = jest.fn();
      ChannelList.getById = jest.fn().mockResolvedValueOnce({
        last_updated_at: '2020-01-01T00:00:00.000Z'
      });

      // Execution
      await channelListSchema.saveIfLatest(mockDb);

      // Assertion
      expect(ChannelList.getById).toHaveBeenCalledTimes(1);
      expect(ChannelList.getById).toHaveBeenCalledWith(mockDb, 'id');
      expect(channelListSchema.save).not.toBeCalled();
    });

    it('TEST should catch error', async () => {
      // Setup
      ChannelList.getById = jest.fn().mockImplementationOnce(() => {
        throw new Error('error');
      });

      // Execution
      await channelListSchema.saveIfLatest(mockDb);

      // Assertion
      expect(ChannelList.getById).toHaveBeenCalledTimes(1);
      expect(ChannelList.getById).toHaveBeenCalledWith(mockDb, 'id');
      expect(consoleSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('TESTING setRead', () => {
    it('TEST should call execute SQL', async () => {
      // Setup

      // Execution
      await channelListSchema.setRead(mockDb);

      // Assertion
      expect(mockDbExecuteSql).toBeCalled();
      expect(mockDbExecuteSql).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['id'])
      );
    });

    it('TEST should catch error ', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => {
        throw new Error('error');
      });

      // Execution
      await channelListSchema.setRead(mockDb);

      // Assertion
      expect(mockDbExecuteSql).toBeCalled();
      expect(mockDbExecuteSql).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['id'])
      );
      expect(consoleSpy).toBeCalled();
    });
  });

  describe('TESTING getUnreadCount', () => {
    it('TEST should return unreadCount if column is set', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            length: 1,
            raw: () => [
              {
                unread_count: 1
              }
            ]
          }
        }
      ]);

      // Execution
      const result = await ChannelList.getUnreadCount(mockDb, 'ANON');

      // Assertion
      expect(result).toBe(1);
    });

    it('TEST should return unreadCount = 0 if column is not set', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            length: 1,
            raw: () => []
          }
        }
      ]);

      // Execution
      const result = await ChannelList.getUnreadCount(mockDb, 'ANON');

      // Assertion
      expect(result).toBe(0);
    });

    it('TEST should catch error', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => {
        throw new Error('error');
      });

      // Execution
      const result = await ChannelList.getUnreadCount(mockDb, 'ANON');

      // Assertion
      expect(consoleSpy).toBeCalled();
      expect(result).toBe(0);
    });
  });

  describe('TESTING static fromPostNotifObject', () => {
    it('TEST should return ChannelListSchema', async () => {
      // Setup
      const postNotifObject = {
        new: [
          {
            id: 'id',
            channel_picture: 'channelPicture',
            name: 'name',
            description: 'description',
            message: 'description',
            unread_count: 0,
            channel_type: 'channelType',
            time: 'lastUpdatedAt',
            actor: {
              id: 'lastUpdatedBy'
            }
          }
        ]
      };

      // Execution
      const result = await ChannelList.fromPostNotifObject(
        postNotifObject,
        'ANON_POST_NOTIFICATION'
      );

      // Assertion
      expect(result).toEqual(expect.objectContaining({channelPicture: ''}));
    });
  });

  describe('TESTING static fromAnonymousPostNotificationAPI', () => {
    it('TEST should return ChannelListSchema', async () => {
      // Setup
      const anonymousPostNotificationAPIObject = {
        activity_id: 'id',
        expired_at: 'expiredAt',
        data: {
          updated_at: 'lastUpdatedAt'
        },
        postMaker: {
          data: {
            profile_pic_url: 'channelPicture'
          }
        },
        titlePost: 'name'
      };

      const anonymousPostNotificationAPIObjectExpectation = {
        ...fromDatabaseObjectExpectation,
        createdAt: expect.any(String),
        channelType: 'ANON_POST_NOTIFICATION',
        description: 'name',
        unreadCount: 0,
        rawJson: expect.any(Object),
        members: null,
        lastUpdatedBy: '',
        id: 'id_anon'
      };

      // Execution
      const result = ChannelList.fromAnonymousPostNotificationAPI(
        anonymousPostNotificationAPIObject
      );

      // Assertion
      expect(result).toEqual(
        expect.objectContaining(anonymousPostNotificationAPIObjectExpectation)
      );
    });
  });

  describe('TESTING static fromInitAnonymousChatAPI', () => {
    it('TEST should return ChannelListSchema', async () => {
      // Setup
      const initAnonymousChatAPIObject = {
        message: {
          cid: 'id',
          message: 'message',
          created_at: 'createdAt',
          user: {
            id: 'lastUpdatedBy'
          }
        },
        targetName: 'name',
        targetImage: ''
      };

      const initAnonymousChatAPIObjectExpectation = {
        ...fromDatabaseObjectExpectation,
        createdAt: 'createdAt',
        lastUpdatedAt: 'createdAt',
        channelType: 'ANON_PM',
        description: 'message',
        unreadCount: 0,
        rawJson: expect.any(Object),
        user: null,
        members: null,
        channelPicture: '',
        expiredAt: null
      };

      // Execution
      const result = ChannelList.fromInitAnonymousChatAPI(initAnonymousChatAPIObject, 'ANON_PM');

      // Assertion
      expect(result).toEqual(expect.objectContaining(initAnonymousChatAPIObjectExpectation));
    });
  });
});
