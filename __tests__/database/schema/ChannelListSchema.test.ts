import ChannelList from '../../../src/database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../../src/database/schema/ChannelListMemberSchema';
import UserSchema from '../../../src/database/schema/UserSchema';
import {consoleSpy} from '../../../__utils__/spy';
import {
  mockDb,
  mockDbExecuteSql,
  mockTransaction,
  mockTransactionExecuteSql
} from '../../../__utils__/mockedVariable/mockDb';

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
  '{}'
];

const updatePrepReplacementExpectation = [
  'channelId',
  'userId',
  'username',
  'countryCode',
  'createdAt',
  'updatedAt',
  'lastActiveAt',
  'profilePicture',
  'bio',
  false,
  'channelId',
  'userId'
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

const isUserExistsPrepReplacementExpectation = ['userId', 'channelId'];

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
    channelType: 'channelType'
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

      ChannelListMemberSchema.getAll = jest.fn().mockResolvedValueOnce([]);
      UserSchema.fromDatabaseObject = jest.fn().mockResolvedValueOnce(null);

      // Execution
      const result = await ChannelList.getChannelInfo(mockDb, 'channelId', 'myId', 'myAnonymousId');

      // Assertion
      expect(ChannelList.getById).toHaveBeenCalledTimes(1);
      expect(ChannelList.getById).toHaveBeenCalledWith(mockDb, 'channelId');
      expect(ChannelListMemberSchema.getAll).toHaveBeenCalledTimes(1);
      expect(ChannelListMemberSchema.getAll).toHaveBeenCalledWith(
        mockDb,
        'channelId',
        'myId',
        'myAnonymousId'
      );
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
      const result = await ChannelList.getUnreadCount(mockDb);

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
      const result = await ChannelList.getUnreadCount(mockDb);

      // Assertion
      expect(result).toBe(0);
    });

    it('TEST should catch error', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => {
        throw new Error('error');
      });

      // Execution
      const result = await ChannelList.getUnreadCount(mockDb);

      // Assertion
      expect(consoleSpy).toBeCalled();
      expect(result).toBe(0);
    });
  });
  //   it('TEST update without transaction', async () => {
  //     // Setup

  //     // Execution
  //     await userSchema.update(mockDb);

  //     // Assertion
  //     expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
  //     expect(mockDb.executeSql).toHaveBeenCalledWith(
  //       expect.any(String),
  //       updatePrepReplacementExpectation
  //     );
  //   });

  //   it('TEST update with transaction', async () => {
  //     // Setup

  //     // Execution
  //     await userSchema.update(mockDb, mockTransaction);

  //     // Assertion
  //     expect(mockTransaction.executeSql).toHaveBeenCalledTimes(1);
  //     expect(mockTransaction.executeSql).toHaveBeenCalledWith(
  //       expect.any(String),
  //       updatePrepReplacementExpectation
  //     );
  //   });

  //   it('TEST update catch error', async () => {
  //     // Setup
  //     mockDbExecuteSql.mockImplementationOnce(() => {
  //       throw new Error('error');
  //     });

  //     // Execution
  //     await userSchema.update(mockDb);

  //     // Assertion
  //     expect(consoleSpy).toBeCalled();
  //   });
  // });

  // describe('TESTING isUserExists function', () => {
  //   it('TEST isUserExists without transaction should return false if no row exists', async () => {
  //     // Setup
  //     mockDbExecuteSql.mockImplementationOnce(() => [{rows: []}, {}]);

  //     // Execution
  //     const isUserExists = await userSchema.isUserExists(mockDb, 'userId', 'channelId');

  //     // Assertion
  //     expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
  //     expect(mockDb.executeSql).toHaveBeenCalledWith(
  //       expect.any(String),
  //       expect.arrayContaining(isUserExistsPrepReplacementExpectation)
  //     );
  //     expect(isUserExists).toBe(false);
  //   });

  //   it('TEST isUserExists without transaction should return true if row exists', async () => {
  //     // Setup
  //     mockDbExecuteSql.mockImplementationOnce(() => [
  //       {rows: [{data: 'data1'}, {data: 'data2'}]},
  //       {}
  //     ]);

  //     // Execution
  //     const isUserExists = await userSchema.isUserExists(mockDb, 'userId', 'channelId');

  //     // Assertion
  //     expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
  //     expect(mockDb.executeSql).toHaveBeenCalledWith(
  //       expect.any(String),
  //       expect.arrayContaining(isUserExistsPrepReplacementExpectation)
  //     );
  //     expect(isUserExists).toBe(true);
  //   });

  //   it('TEST isUserExists with transaction should return false is no row exists', async () => {
  //     // Setup
  //     mockTransactionExecuteSql.mockImplementationOnce(() => [{}, {rows: []}]);

  //     // Execution
  //     const isUserExists = await userSchema.isUserExists(
  //       mockDb,
  //       'userId',
  //       'channelId',
  //       mockTransaction
  //     );

  //     // Assertion
  //     expect(mockTransaction.executeSql).toHaveBeenCalledTimes(1);
  //     expect(mockTransaction.executeSql).toHaveBeenCalledWith(
  //       expect.any(String),
  //       expect.arrayContaining(isUserExistsPrepReplacementExpectation)
  //     );
  //     expect(isUserExists).toBe(false);
  //   });

  //   it('TEST isUserExists with transaction should return true is row exists', async () => {
  //     // Setup
  //     mockTransactionExecuteSql.mockImplementationOnce(() => [
  //       {},
  //       {rows: [{data: 'data1'}, {data: 'data2'}]}
  //     ]);

  //     // Execution
  //     await userSchema.isUserExists(mockDb, 'userId', 'channelId', mockTransaction);

  //     // Assertion
  //     expect(mockTransaction.executeSql).toHaveBeenCalledTimes(1);
  //     expect(mockTransaction.executeSql).toHaveBeenCalledWith(
  //       expect.any(String),
  //       expect.arrayContaining(isUserExistsPrepReplacementExpectation)
  //     );
  //   });

  //   it('TEST isUserExists catch error', async () => {
  //     // Setup
  //     mockDbExecuteSql.mockImplementationOnce(() => {
  //       throw new Error('error');
  //     });

  //     // Execution
  //     const isUserExists = await userSchema.isUserExists(mockDb, 'userId', 'channelId');

  //     // Assertion
  //     expect(consoleSpy).toBeCalled();
  //     expect(isUserExists).toBe(false);
  //   });
  // });

  // describe('TESTING saveOrUpdateIfExists function', () => {
  //   it('TEST saveOrUpdateIfExists should call update if user exists', async () => {
  //     // Setup
  //     mockTransactionExecuteSql.mockImplementationOnce(() => [
  //       {},
  //       {rows: [{data: 'data1'}, {data: 'data2'}]}
  //     ]);

  //     // Execution
  //     await userSchema.saveOrUpdateIfExists(mockDb);

  //     // Assertion
  //     expect(mockTransaction.executeSql).toHaveBeenCalledTimes(1);
  //     expect(mockTransaction.executeSql).toHaveBeenCalledWith(
  //       expect.any(String),
  //       expect.arrayContaining(isUserExistsPrepReplacementExpectation),
  //       expect.any(Function)
  //     );
  //   });
  // });

  // describe('TESTING static fromWebsocketObject function', () => {
  //   it('TEST fromWebsocketObject should return UserSchema', () => {
  //     // Setup
  //     const fromWebsocketObjectExpectation = {
  //       id: expect.any(String),
  //       channelId: 'channelId',
  //       userId: 'userId',
  //       username: 'username',
  //       countryCode: '',
  //       createdAt: 'createdAt',
  //       updatedAt: 'updatedAt',
  //       lastActiveAt: 'lastActiveAt',
  //       profilePicture: 'profilePicture',
  //       bio: '',
  //       isBanned: false
  //     };

  //     // Execution
  //     const result = UserSchema.fromWebsocketObject({
  //       message: {
  //         cid: 'messaging:channelId',
  //         user: {
  //           id: 'userId',
  //           name: 'username',
  //           last_active_at: 'lastActiveAt',
  //           image: 'profilePicture'
  //         },
  //         created_at: 'createdAt',
  //         updated_at: 'updatedAt'
  //       },
  //       is_banned: false
  //     });

  //     // Assertion
  //     expect(result).toEqual(expect.objectContaining(fromWebsocketObjectExpectation));
  //   });
  // });

  // describe('TESTING static fromMemberWebsoketObject function', () => {
  //   it('TEST fromMemberWebsocketObject should return UserSchema', () => {
  //     // Setup
  //     const fromMemberWebsocketObjectExpectation = {
  //       id: expect.any(String),
  //       channelId: 'channelId',
  //       userId: 'userId',
  //       username: 'username',
  //       countryCode: '',
  //       createdAt: 'createdAt',
  //       updatedAt: 'updatedAt',
  //       lastActiveAt: 'lastActiveAt',
  //       profilePicture: 'profilePicture',
  //       bio: '',
  //       isBanned: false
  //     };

  //     // Execution
  //     const result = UserSchema.fromMemberWebsocketObject(
  //       {
  //         user: {
  //           id: 'userId',
  //           name: 'username',
  //           last_active: 'lastActiveAt',
  //           created_at: 'createdAt',
  //           image: 'profilePicture'
  //         },
  //         created_at: 'createdAt',
  //         updated_at: 'updatedAt',
  //         banned: false
  //       },
  //       'channelId'
  //     );

  //     // Assertion
  //     expect(result).toEqual(expect.objectContaining(fromMemberWebsocketObjectExpectation));
  //   });
  // });

  // describe('TESTING static fromInitAnonymousChatAPI function', () => {
  //   it('TEST fromAnonymousChatAPI should return UserSchema', () => {
  //     // Setup
  //     const fromAnonymousChatAPIExpectation = {
  //       id: expect.any(String),
  //       channelId: 'channelId',
  //       userId: 'userId',
  //       bio: 'bio',
  //       countryCode: 'countryCode',
  //       createdAt: 'createdAt',
  //       lastActiveAt: 'lastActiveAt',
  //       profilePicture: 'profilePicture',
  //       updatedAt: 'updatedAt',
  //       username: 'username',
  //       isBanned: false
  //     };

  //     // Execution
  //     const result = UserSchema.fromInitAnonymousChatAPI(
  //       {
  //         user_id: 'userId',
  //         bio: 'bio',
  //         country_code: 'countryCode',
  //         created_at: 'createdAt',
  //         last_active_at: 'lastActiveAt',
  //         profile_pic_path: 'profilePicture',
  //         updated_at: 'updatedAt',
  //         username: 'username',
  //         is_banned: false
  //       },
  //       'channelId'
  //     );

  //     // Assertion
  //     expect(result).toEqual(expect.objectContaining(fromAnonymousChatAPIExpectation));
  //   });
  // });
});
