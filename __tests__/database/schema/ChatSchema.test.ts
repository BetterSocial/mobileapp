import ChatSchema from '../../../src/database/schema/ChatSchema';
import {consoleSpy} from '../../../__utils__/spy';
import {mockDb, mockDbExecuteSql} from '../../../__utils__/mockedVariable/mockDb';

const chatSchema = new ChatSchema({
  id: 'id',
  channelId: 'channelId',
  userId: 'userId',
  message: 'message',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  rawJson: {},
  attachmentJson: [],
  user: null,
  status: 'status',
  isMe: false,
  isContinuous: false
});

const savePrepReplacementExpectation = [
  'id',
  'channelId',
  'userId',
  'message',
  'type',
  'status',
  'createdAt',
  'updatedAt',
  {},
  []
];

const fromDatabaseObjectExpectation = {
  id: 'id',
  channelId: 'channelId',
  userId: 'userId',
  message: 'message',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  rawJson: {},
  attachmentJson: [],
  status: 'status',
  isMe: false,
  isContinuous: false
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING ChatSchema', () => {
  describe('TESTING unimplemented function', () => {
    it('TEST getAll should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => chatSchema.getAll(mockDb)).toThrow('Method not implemented');
    });

    it('TEST getTableNaame should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => chatSchema.getTableName()).toThrow('Method not implemented');
    });

    it('TEST fromDatabaseObject should throw method not implemented', async () => {
      // Setup

      // Execution

      // Assertion
      expect(() => chatSchema.fromDatabaseObject({})).toThrow('Method not implemented');
    });
  });

  describe('TESTING static getTableName function', () => {
    it('TEST should return table name', () => {
      expect(ChatSchema.getTableName()).toBe('chats');
    });
  });

  describe('TESTING static getAll function', () => {
    it('TEST getAll should return array of ChatSchema', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            raw: () => [
              {
                id: 'id',
                channel_id: 'channelId',
                user_id: 'userId',
                message: 'message',
                type: 'type',
                created_at: 'createdAt',
                updated_at: 'updatedAt',
                raw_json: '{}',
                attachment_json: '[]',
                user: null,
                status: 'status',
                is_me: false,
                is_continuous: false
              }
            ]
          }
        }
      ]);

      // Execution
      const result = await ChatSchema.getAll(mockDb, 'channelId', 'myId', 'myAnonymousId');

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String), [
        'myId',
        'myAnonymousId',
        'channelId'
      ]);
      expect(result).toEqual([expect.objectContaining(fromDatabaseObjectExpectation)]);
    });
  });

  describe('TESTING static clearAll function', () => {
    it('TEST should clear all data', async () => {
      // Setup

      // Execution
      await ChatSchema.clearAll(mockDb);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith('DELETE FROM chats');
    });
  });

  describe('TESTING updateChatSentStatus function', () => {
    it('TEST updateChatSentStatus should update status to sent', async () => {
      // Setup
      const response = {
        message: {
          created_at: 'createdAt',
          id: 'messageId',
          updated_at: 'updatedAt',
          attachments: '[]'
        }
      };

      // Execution
      await chatSchema.updateChatSentStatus(mockDb, response);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String), [
        'sent',
        'createdAt',
        'updatedAt',
        expect.any(String),
        'messageId',
        expect.any(String),
        'id'
      ]);
    });

    it('TEST should catch error', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => {
        throw new Error('error');
      });

      const response = {
        message: {
          created_at: 'createdAt',
          id: 'messageId',
          updated_at: 'updatedAt',
          attachments: '[]'
        }
      };

      // Execution
      await chatSchema.updateChatSentStatus(mockDb, response);

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String), [
        'sent',
        'createdAt',
        'updatedAt',
        expect.any(String),
        'messageId',
        expect.any(String),
        'id'
      ]);

      expect(consoleSpy).toBeCalledTimes(3);
    });
  });

  describe('TESTING save function', () => {
    it('TEST save without transaction', async () => {
      // Setup

      // Execution
      await chatSchema.save(mockDb);

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
      await chatSchema.save(mockDb);

      // Assertion
      expect(consoleSpy).toBeCalledTimes(2);
    });
  });

  describe('TESTING getById function', () => {
    it('TEST getById should return ChatSchema if row exists', async () => {
      // Setup
      mockDbExecuteSql.mockImplementationOnce(() => [
        {
          rows: {
            raw: () => [
              {
                id: 'id',
                channel_id: 'channelId',
                user_id: 'userId',
                message: 'message',
                type: 'type',
                created_at: 'createdAt',
                updated_at: 'updatedAt',
                raw_json: '{}',
                attachment_json: '[]',
                user: null,
                status: 'status',
                is_me: false,
                is_continuous: false
              }
            ]
          }
        }
      ]);

      // Execution
      const result = await ChatSchema.getByid(mockDb, 'id');

      // Assertion
      expect(mockDb.executeSql).toHaveBeenCalledTimes(1);
      expect(mockDb.executeSql).toHaveBeenCalledWith(expect.any(String), ['id']);
      expect(result).toEqual(expect.objectContaining(fromDatabaseObjectExpectation));
    });
  });

  describe('TESTING static fromWebsocketObject function', () => {
    it('TEST fromWebsocketObject should return ChatSchema', () => {
      // Setup
      const fromWebsocketObjectExpectation = {
        id: 'id',
        channelId: 'channelId',
        userId: 'userId',
        message: 'message',
        type: 'type',
        createdAt: 'createdAt',
        updatedAt: 'createdAt',
        rawJson: expect.any(String),
        attachmentJson: expect.any(String),
        user: null,
        status: 'sent',
        isMe: false,
        isContinuous: false
      };

      // Execution
      const result = ChatSchema.fromWebsocketObject({
        channel_id: 'channelId',
        message: {
          id: 'id',
          cid: 'messaging:channelId',
          user: {
            id: 'userId',
            name: 'username',
            last_active_at: 'lastActiveAt',
            image: 'profilePicture'
          },
          text: 'message',
          type: 'type',
          message: 'message',
          attachments: [
            {
              type: 'image',
              thumb_url: 'thumb_url',
              asset_url: 'asset_url',
              myCustomField: 'image'
            }
          ],
          created_at: 'createdAt',
          updated_at: 'updatedAt'
        },
        is_banned: false
      });

      // Assertion
      expect(result).toEqual(expect.objectContaining(fromWebsocketObjectExpectation));
    });

    it('TEST fromWebsocketObject should catch error if param is null', () => {
      // Setup

      // Execution
      const execution = () => ChatSchema.fromWebsocketObject(null);

      // Assertion
      expect(execution).toThrow('ChatSchema must have an id');
    });
  });

  describe('TESTING static fromGetAllAnonymousChannelAPI function', () => {
    it('TEST fromGetAllAnonymousChannelAPI should return ChatSchema', () => {
      // Setup
      const fromGetAllAnonymousChannelAPIExpectation = {
        id: 'id',
        channelId: 'channelId',
        userId: 'userId',
        message: 'message',
        type: 'type',
        createdAt: 'createdAt',
        updatedAt: 'createdAt',
        rawJson: expect.any(String),
        attachmentJson: expect.any(String),
        user: null,
        status: 'sent',
        isMe: false,
        isContinuous: false
      };

      // Execution
      const result = ChatSchema.fromGetAllAnonymousChannelAPI('channelId', {
        id: 'id',
        user: {
          id: 'userId',
          name: 'username',
          last_active_at: 'lastActiveAt',
          image: 'profilePicture'
        },
        text: 'message',
        type: 'type',
        message: 'message',
        attachments: [
          {
            type: 'image',
            thumb_url: 'thumb_url',
            asset_url: 'asset_url',
            myCustomField: 'image'
          }
        ],
        created_at: 'createdAt',
        updated_at: 'updatedAt'
      });

      // Assertion
      expect(result).toEqual(expect.objectContaining(fromGetAllAnonymousChannelAPIExpectation));
    });
  });

  describe('TESTING static fromInitAnonymousChatAPI function', () => {
    it('TEST fromInitAnonymousChatAPI should return ChatSchema', () => {
      // Setup
      const fromInitAnonymousChatAPIExpectation = {
        channelId: 'channelId',
        createdAt: 'createdAt',
        id: 'id',
        isContinuous: false,
        isMe: true,
        message: 'message',
        rawJson: expect.any(String),
        attachmentJson: expect.any(String),
        status: 'sent',
        type: 'regular',
        updatedAt: 'updatedAt',
        user: null,
        userId: 'userId'
      };

      // Execution
      const result = ChatSchema.fromInitAnonymousChatAPI({
        duration: '0',
        members: [],
        targetImage: '',
        targetName: '',
        message: {
          id: 'id',
          cid: 'channelId',
          user: {
            id: 'userId',
            name: 'username',
            last_active: 'lastActiveAt',
            image: 'profilePicture',
            role: 'role',
            created_at: 'createdAt',
            updated_at: 'updatedAt',
            banned: false,
            online: false,
            username: 'username'
          },
          text: 'message',
          type: 'type',
          message: 'message',
          created_at: 'createdAt',
          updated_at: 'updatedAt',
          html: '',
          attachments: [],
          latest_reactions: [],
          own_reactions: [],
          reaction_counts: undefined,
          reaction_scores: undefined,
          reply_count: 0,
          shadowed: false,
          mentioned_users: [],
          silent: false,
          pinned: false,
          pinned_at: undefined,
          pinned_by: undefined,
          pin_expires: undefined,
          members: [],
          anon_user_info_color_code: '',
          anon_user_info_color_name: '',
          anon_user_info_emoji_code: '',
          anon_user_info_emoji_name: ''
        }
      });

      // Assertion
      // TODO: error testing
      // expect(result).toEqual(expect.objectContaining(fromInitAnonymousChatAPIExpectation));
    });
  });

  describe('TESTING static generateSendingChat function', () => {
    it('TEST should return ChatSchema with existing chat', async () => {
      // Setup
      ChatSchema.getByid = jest.fn().mockResolvedValueOnce(null);

      const generateSendingChatExpectation = {
        channelId: 'channelId',
        createdAt: expect.any(String),
        id: 'id',
        isContinuous: true,
        isMe: true,
        message: 'message',
        rawJson: null,
        attachmentJson: '[]',
        status: 'pending',
        type: 'regular',
        updatedAt: expect.any(String),
        user: null,
        userId: 'userId'
      };

      // Execution
      const result = await ChatSchema.generateSendingChat(
        'id',
        'userId',
        'channelId',
        'message',
        [],
        mockDb
      );

      // Assertion
      expect(result).toEqual(expect.objectContaining(generateSendingChatExpectation));
    });

    it('TEST should return ChatSchema with not existing chat', async () => {
      // Setup
      ChatSchema.getByid = jest.fn().mockResolvedValueOnce(true);

      const generateSendingChatExpectation = {
        channelId: 'channelId',
        createdAt: expect.any(String),
        id: expect.any(String),
        isContinuous: true,
        isMe: true,
        message: 'message',
        rawJson: null,
        attachmentJson: '[]',
        status: 'pending',
        type: 'regular',
        updatedAt: expect.any(String),
        user: null,
        userId: 'userId'
      };

      // Execution
      const result = await ChatSchema.generateSendingChat(
        'id',
        'userId',
        'channelId',
        'message',
        [],
        mockDb
      );

      // Assertion
      expect(result).toEqual(expect.objectContaining(generateSendingChatExpectation));
    });
  });
});
