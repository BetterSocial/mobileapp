import ChannelListMemberSchema from '../../../src/database/schema/ChannelListMemberSchema';
import {InitAnonymousChatDataMember} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';
import {consoleSpy, promiseRejectSpy} from '../../../__utils__/spy';
import {mockDb, mockDbExecuteSql, mockTransaction} from '../../../__utils__/mockedVariable/mockDb';

let channelListMemberSchema: ChannelListMemberSchema;

const savePrepReplacementExpectation = [
  'id',
  'channelId',
  'userId',
  false,
  false,
  false,
  'joinedAt'
];

const fromDatabaseObjectExpectation = {
  id: 'id',
  channelId: 'channelId',
  userId: 'userId',
  isModerator: false,
  isShadowBanned: false,
  joinedAt: 'joinedAt',
  isBanned: false,
  user: expect.any(Object)
};

const fromWebsocketObjectExpectation = {
  id: 'messageId',
  channelId: 'channelId',
  userId: 'userId',
  isModerator: false,
  isShadowBanned: false,
  joinedAt: 'joinedAt',
  isBanned: false,
  user: null
};

beforeEach(() => {
  jest.clearAllMocks();
  channelListMemberSchema = new ChannelListMemberSchema({
    channelId: 'channelId',
    userId: 'userId',
    isModerator: false,
    isBanned: false,
    isShadowBanned: false,
    id: 'id',
    joinedAt: 'joinedAt',
    user: null
  });
});

describe('TESTING ChannelListMemberSchema', () => {
  describe('TESTING unimplemented function', () => {
    it('TEST getAll should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => channelListMemberSchema.getAll(mockDb)).toThrow('Method not implemented');
    });

    it('TEST getTableNaame should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => channelListMemberSchema.getTableName()).toThrow('Method not implemented');
    });

    it('TEST fromDatabaseObject should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => channelListMemberSchema.fromDatabaseObject({})).toThrow(
        'Method not implemented'
      );
    });
  });

  describe('TESTING static getTableName function', () => {
    it('TEST should return table name', () => {
      expect(ChannelListMemberSchema.getTableName()).toBe('channel_list_members');
    });
  });

  describe('TESTING static getAll function', () => {
    it('TEST getAll should return array of ChannelListMemberSchema', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            raw: () => [
              {
                id: 'id',
                channel_id: 'channelId',
                user_id: 'userId',
                is_moderator: false,
                is_shadow_banned: false,
                joined_at: 'joinedAt',
                is_banned: false
              }
            ]
          }
        }
      ]);

      // Execution
      const result = await ChannelListMemberSchema.getAll(
        mockDb,
        'channelId',
        'myId',
        'myAnonymousId'
      );

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String), [
        'myId',
        'myAnonymousId',
        'channelId'
      ]);

      expect(result).toEqual([expect.objectContaining(fromDatabaseObjectExpectation)]);
    });

    it('TEST getAll catch error', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => {
        throw new Error('error');
      });

      // Execution
      await ChannelListMemberSchema.getAll(mockDb, 'channelId', 'myId', 'myAnonymousId');

      // Assertion
      expect(promiseRejectSpy).toBeCalled();
    });
  });

  describe('TESTING static clearAll function', () => {
    it('TEST should clear all data', async () => {
      // Setup

      // Execution
      await ChannelListMemberSchema.clearAll(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith('DELETE FROM channel_list_members');
    });
  });

  describe('TESTING checkIfExist function', () => {
    it('TEST should return true if row exists', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            length: 1
          }
        }
      ]);

      // Execution
      const result = await channelListMemberSchema.checkIfExist(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String), ['channelId', 'userId']);
    });

    it('TEST should return false if row does not exist', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            length: 0
          }
        }
      ]);

      // Execution
      const result = await channelListMemberSchema.checkIfExist(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String), ['channelId', 'userId']);
    });

    it('TEST should catch error', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => {
        return new Error('error');
      });

      // Execution
      await channelListMemberSchema.checkIfExist(mockDb);

      // Assertion
      expect(promiseRejectSpy).toBeCalled();
    });
  });

  describe('TESTING saveIfNotExist function', () => {
    it('TEST should call save if row does not exist', async () => {
      // Setup
      channelListMemberSchema.save = jest.fn();
      channelListMemberSchema.checkIfExist = jest.fn().mockResolvedValueOnce(false);

      // Execution
      await channelListMemberSchema.saveIfNotExist(mockDb);

      // Assertion
      expect(channelListMemberSchema.save).toHaveBeenCalledTimes(1);
    });

    it('TEST does not do anything if row exists', async () => {
      // Setup
      channelListMemberSchema.save = jest.fn();
      channelListMemberSchema.checkIfExist = jest.fn().mockResolvedValueOnce(true);

      // Execution
      await channelListMemberSchema.saveIfNotExist(mockDb);

      // Assertion
      expect(channelListMemberSchema.save).toBeCalledTimes(0);
    });
  });

  describe('TESTING save function', () => {
    it('TEST save without transaction', async () => {
      // Setup
      channelListMemberSchema.checkIfExist = jest.fn().mockResolvedValueOnce(false);

      // Execution
      await channelListMemberSchema.save(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        savePrepReplacementExpectation
      );
    });

    it('TEST save with transaction', async () => {
      // Setup
      channelListMemberSchema.checkIfExist = jest.fn().mockResolvedValueOnce(false);

      // Execution
      await channelListMemberSchema.save(mockDb, mockTransaction);

      // Assertion
      expect(mockTransaction.executeSql).toHaveBeenCalledTimes(1);
      expect(mockTransaction.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        savePrepReplacementExpectation
      );
    });

    it('TEST save catch error', async () => {
      // Setup
      channelListMemberSchema.checkIfExist = jest.fn().mockResolvedValueOnce(false);
      mockDbExecuteSql.mockImplementationOnce(() => {
        throw new Error('error');
      });

      // Execution
      await channelListMemberSchema.save(mockDb);

      // Assertion
      expect(consoleSpy).toBeCalled();
    });

    it('TEST should do nothing if row exists', async () => {
      channelListMemberSchema.checkIfExist = jest.fn().mockResolvedValueOnce(true);

      // Execution
      await channelListMemberSchema.save(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(0);
      expect(mockTransaction.executeSql).toHaveBeenCalledTimes(0);
    });
  });

  describe('TESTING fromWebsocketObject function', () => {
    it('TEST should return ChannelListMemberSchema', () => {
      // Setup
      const data = {
        id: 'id',
        channel_id: 'channelId',
        user_id: 'userId',
        is_moderator: false,
        shadow_banned: false,
        updated_at: 'joinedAt',
        banned: false,
        user: {
          id: 'userId',
          username: 'username',
          country_code: 'countryCode',
          profile_picture: 'profilePicture',
          bio: 'bio',
          is_banned: false,
          last_active_at: 'lastActiveAt'
        }
      };

      // Execution
      const result = ChannelListMemberSchema.fromWebsocketObject('channelId', 'messageId', data);

      // Assertion
      expect(result).toEqual(expect.objectContaining(fromWebsocketObjectExpectation));
    });
  });

  describe('TESTING fromMessageAnonymousChatAPI function', () => {
    it('TEST should return ChannelListMemberSchema', () => {
      // Setup
      const data = {
        id: 'id',
        channel_id: 'channelId',
        user_id: 'userId',
        is_moderator: false,
        shadow_banned: false,
        updated_at: 'joinedAt',
        banned: false,
        user: {
          id: 'userId',
          username: 'username',
          country_code: 'countryCode',
          profile_picture: 'profilePicture',
          bio: 'bio',
          is_banned: false,
          last_active_at: 'lastActiveAt'
        }
      };

      // Execution
      const result = ChannelListMemberSchema.fromWebsocketObject('channelId', 'messageId', data);

      // Assertion
      expect(result).toEqual(expect.objectContaining(fromWebsocketObjectExpectation));
    });
  });

  describe('TESTING fromInitAnonymousChatAPI function', () => {
    it('TEST should return ChannelListMemberSchema', () => {
      // Setup
      const data: InitAnonymousChatDataMember = {
        user_id: 'userId',
        is_banned: false,
        updated_at: 'joinedAt',
        username: '',
        profile_pic_path: ''
      };

      // Execution
      const result = ChannelListMemberSchema.fromInitAnonymousChatAPI(
        'channelId',
        'messageId',
        data
      );

      // Assertion
      expect(result).toEqual(expect.objectContaining(fromWebsocketObjectExpectation));
    });
  });
});
