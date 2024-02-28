import UserSchema from '../../../src/database/schema/UserSchema';
import {consoleSpy} from '../../../__utils__/spy';
import {
  mockDb,
  mockDbExecuteSql,
  mockTransaction,
  mockTransactionExecuteSql
} from '../../../__utils__/mockedVariable/mockDb';

const userSchema = new UserSchema({
  id: 'id',
  channelId: 'channelId',
  userId: 'userId',
  username: 'username',
  countryCode: 'countryCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastActiveAt: 'lastActiveAt',
  profilePicture: 'profilePicture',
  bio: 'bio',
  isBanned: false,
  isMe: false,
  anon_user_info_color_code: null,
  anon_user_info_color_name: null,
  anon_user_info_emoji_code: null,
  anon_user_info_emoji_name: null,
  isAnonymous: null
});

const savePrepReplacementExpectation = [
  'id',
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
  null,
  null,
  null,
  null,
  null
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
  null,
  null,
  null,
  null,
  null,
  'channelId',
  'userId'
];

const fromDatabaseObjectExpectation = {
  id: 'id',
  channelId: 'channelId',
  userId: 'userId',
  username: 'username',
  countryCode: 'countryCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastActiveAt: 'lastActiveAt',
  profilePicture: 'profilePicture',
  bio: 'bio',
  isBanned: false,
  isMe: false
};

const isUserExistsPrepReplacementExpectation = ['userId', 'channelId'];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING UserSchema', () => {
  describe('TESTING unimplemented function', () => {
    it('TEST getAll should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => userSchema.getAll(mockDb)).toThrow('Method not implemented');
    });

    it('TEST getTableNaame should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => userSchema.getTableName()).toThrow('Method not implemented');
    });

    it('TEST fromDatabaseObject should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => userSchema.fromDatabaseObject({})).toThrow('Method not implemented');
    });
  });

  describe('TESTING get function', () => {
    it('TEST get should return UserSchema', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: [
            {
              raw: () => [
                {
                  id: 'id',
                  channel_id: 'channelId',
                  user_id: 'userId',
                  username: 'username',
                  country_code: 'countryCode',
                  created_at: 'createdAt',
                  updated_at: 'updatedAt',
                  last_active_at: 'lastActiveAt',
                  profile_picture: 'profilePicture',
                  bio: 'bio',
                  is_banned: false,
                  is_me: false
                }
              ]
            }
          ]
        }
      ]);

      // Execution
      const result = await userSchema.get(mockDb, 'userId');

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['userId'])
      );
      expect(result).toEqual(expect.objectContaining(fromDatabaseObjectExpectation));
    });
  });

  describe('TESTING static getTableName function', () => {
    it('TEST should return table name', () => {
      expect(UserSchema.getTableName()).toBe('users');
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
                channel_id: 'channelId',
                user_id: 'userId',
                username: 'username',
                country_code: 'countryCode',
                created_at: 'createdAt',
                updated_at: 'updatedAt',
                last_active_at: 'lastActiveAt',
                profile_picture: 'profilePicture',
                bio: 'bio',
                is_banned: false,
                is_me: false
              }
            ]
          }
        }
      ]);

      // Execution
      const result = await UserSchema.getAll(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual([expect.objectContaining(fromDatabaseObjectExpectation)]);
    });
  });

  describe('TESTING static clearAll function', () => {
    it('TEST should clear all data', async () => {
      // Setup

      // Execution
      await UserSchema.clearAll(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith('DELETE FROM users');
    });
  });

  describe('TESTING save function', () => {
    it('TEST save without transaction', async () => {
      // Setup

      // Execution
      await userSchema.save(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        savePrepReplacementExpectation
      );
    });

    it('TEST save with transaction', async () => {
      // Setup

      // Execution
      await userSchema.save(mockDb, mockTransaction);

      // Assertion
      expect(mockTransaction.executeSql).toHaveBeenCalledTimes(1);
      expect(mockTransaction.executeSql).toHaveBeenCalledWith(
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
      await userSchema.save(mockDb);

      // Assertion
      expect(consoleSpy).toBeCalled();
    });
  });

  describe('TESTING update function', () => {
    it('TEST update without transaction', async () => {
      // Setup

      // Execution
      await userSchema.update(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        updatePrepReplacementExpectation
      );
    });

    it('TEST update with transaction', async () => {
      // Setup

      // Execution
      await userSchema.update(mockDb, mockTransaction);

      // Assertion
      expect(mockTransaction.executeSql).toHaveBeenCalledTimes(1);
      expect(mockTransaction.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        updatePrepReplacementExpectation
      );
    });

    it('TEST update catch error', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => {
        throw new Error('error');
      });

      // Execution
      await userSchema.update(mockDb);

      // Assertion
      expect(consoleSpy).toBeCalled();
    });
  });

  describe('TESTING isUserExists function', () => {
    it('TEST isUserExists without transaction should return false if no row exists', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [{rows: []}, {}]);

      // Execution
      const isUserExists = await userSchema.isUserExists(mockDb, 'userId', 'channelId');

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(isUserExistsPrepReplacementExpectation)
      );
      expect(isUserExists).toBe(false);
    });

    it('TEST isUserExists without transaction should return true if row exists', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {rows: [{data: 'data1'}, {data: 'data2'}]},
        {}
      ]);

      // Execution
      const isUserExists = await userSchema.isUserExists(mockDb, 'userId', 'channelId');

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(isUserExistsPrepReplacementExpectation)
      );
      expect(isUserExists).toBe(true);
    });

    it('TEST isUserExists with transaction should return false is no row exists', async () => {
      // Setup
      mockTransactionExecuteSql.mockImplementationOnce(() => [{}, {rows: []}]);

      // Execution
      const isUserExists = await userSchema.isUserExists(
        mockDb,
        'userId',
        'channelId',
        mockTransaction
      );

      // Assertion
      expect(mockTransaction.executeSql).toHaveBeenCalledTimes(1);
      expect(mockTransaction.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(isUserExistsPrepReplacementExpectation)
      );
      expect(isUserExists).toBe(false);
    });

    it('TEST isUserExists with transaction should return true is row exists', async () => {
      // Setup
      mockTransactionExecuteSql.mockImplementationOnce(() => [
        {},
        {rows: [{data: 'data1'}, {data: 'data2'}]}
      ]);

      // Execution
      await userSchema.isUserExists(mockDb, 'userId', 'channelId', mockTransaction);

      // Assertion
      expect(mockTransaction.executeSql).toHaveBeenCalledTimes(1);
      expect(mockTransaction.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(isUserExistsPrepReplacementExpectation)
      );
    });

    it('TEST isUserExists catch error', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => {
        throw new Error('error');
      });

      // Execution
      const isUserExists = await userSchema.isUserExists(mockDb, 'userId', 'channelId');

      // Assertion
      expect(consoleSpy).toBeCalled();
      expect(isUserExists).toBe(false);
    });
  });

  describe('TESTING saveOrUpdateIfExists function', () => {
    it('TEST saveOrUpdateIfExists should call update if user exists', async () => {
      // Setup
      mockTransactionExecuteSql.mockImplementationOnce(() => [
        {},
        {rows: [{data: 'data1'}, {data: 'data2'}]}
      ]);

      // Execution
      await userSchema.saveOrUpdateIfExists(mockDb);

      // Assertion
      expect(mockTransaction.executeSql).toHaveBeenCalledTimes(1);
      expect(mockTransaction.executeSql).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(isUserExistsPrepReplacementExpectation),
        expect.any(Function)
      );
    });
  });

  describe('TESTING static fromWebsocketObject function', () => {
    it('TEST fromWebsocketObject should return UserSchema', () => {
      // Setup
      const fromWebsocketObjectExpectation = {
        id: expect.any(String),
        channelId: 'channelId',
        userId: 'userId',
        username: 'username',
        countryCode: '',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        lastActiveAt: 'lastActiveAt',
        profilePicture: 'profilePicture',
        bio: '',
        isBanned: false
      };

      // Execution
      const result = UserSchema.fromWebsocketObject({
        message: {
          cid: 'messaging:channelId',
          user: {
            id: 'userId',
            name: 'username',
            last_active_at: 'lastActiveAt',
            image: 'profilePicture'
          },
          created_at: 'createdAt',
          updated_at: 'updatedAt'
        },
        is_banned: false
      });

      // Assertion
      expect(result).toEqual(expect.objectContaining(fromWebsocketObjectExpectation));
    });
  });

  describe('TESTING static fromMemberWebsoketObject function', () => {
    it('TEST fromMemberWebsocketObject should return UserSchema', () => {
      // Setup
      const fromMemberWebsocketObjectExpectation = {
        id: expect.any(String),
        channelId: 'channelId',
        userId: 'userId',
        username: 'username',
        countryCode: '',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        lastActiveAt: 'lastActiveAt',
        profilePicture: 'profilePicture',
        bio: '',
        isBanned: false
      };

      // Execution
      const result = UserSchema.fromMemberWebsocketObject(
        {
          user: {
            id: 'userId',
            name: 'username',
            last_active: 'lastActiveAt',
            created_at: 'createdAt',
            image: 'profilePicture',
            username: 'username'
          },
          created_at: 'createdAt',
          updated_at: 'updatedAt',
          banned: false
        },
        'channelId'
      );

      // Assertion
      expect(result).toEqual(expect.objectContaining(fromMemberWebsocketObjectExpectation));
    });
  });

  describe('TESTING static fromInitAnonymousChatAPI function', () => {
    it('TEST fromAnonymousChatAPI should return UserSchema', () => {
      // Setup
      const fromAnonymousChatAPIExpectation = {
        id: expect.any(String),
        channelId: 'channelId',
        userId: 'userId',
        bio: 'bio',
        countryCode: 'countryCode',
        createdAt: 'createdAt',
        lastActiveAt: 'lastActiveAt',
        profilePicture:
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1680929851/default-profile-picture_vrmmdn.png',
        updatedAt: 'updatedAt',
        username: 'username',
        isBanned: false
      };

      // Execution
      const result = UserSchema.fromInitAnonymousChatAPI(
        {
          user_id: 'userId',
          bio: 'bio',
          country_code: 'countryCode',
          created_at: 'createdAt',
          last_active_at: 'lastActiveAt',
          profile_pic_path: 'profilePicture',
          updated_at: 'updatedAt',
          username: 'username',
          is_banned: false,
          last_active_at: 'lastActiveAt',
          user: {
            banned: false,
            id: 'userId',
            name: 'username',
            username: 'username',
            last_active_at: 'lastActiveAt',
            image: 'profilePicture',
            image:
              'https://res.cloudinary.com/hpjivutj2/image/upload/v1680929851/default-profile-picture_vrmmdn.png',
            created_at: 'createdAt'
          }
        },
        'channelId'
      );

      // Assertion
      expect(result).toEqual(expect.objectContaining(fromAnonymousChatAPIExpectation));
    });
  });
});
