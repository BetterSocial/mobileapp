import AnonymousMessageRepo from '../../src/service/repo/anonymousMessageRepo';
import anonymousApi from '../../src/service/anonymousConfig';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING anonymousMessageRepo', () => {
  describe('TESTING setChannelAsRead', () => {
    it('TEST should call post with defined url and return true if status 200', async () => {
      anonymousApi.post.mockResolvedValueOnce({
        status: 200,
        data: {
          status: 200
        }
      });

      // Execution
      const result = await AnonymousMessageRepo.setChannelAsRead('channelId');

      // Assertion
      expect(result).toBe(true);
      expect(anonymousApi.post).toBeCalledWith('/chat/channels/channelId/read', {
        channelType: 'messaging'
      });
    });
  });

  describe('TESTING setChannelAsRead', () => {
    it('TEST should call post with defined url and return true if status 200', async () => {
      anonymousApi.get.mockResolvedValueOnce({
        status: 200,
        data: {
          status: 200,
          data: {}
        }
      });

      // Execution
      const result = await AnonymousMessageRepo.getSingleAnonymousPostNotifications('activityId');

      // Assertion
      expect(result).toEqual({});
      expect(anonymousApi.get).toBeCalledWith('/feeds/feed-chat/activityId');
    });
  });

  describe('TESTING getAllAnonymousPostNotification', () => {
    it('TEST should call get with defined url and return true if status 200', async () => {
      anonymousApi.get.mockResolvedValueOnce({
        status: 200,
        data: {
          status: 200,
          data: []
        }
      });

      // Execution
      const result = await AnonymousMessageRepo.getAllAnonymousPostNotifications();

      // Assertion
      expect(result).toEqual([]);
      expect(anonymousApi.get).toBeCalledWith('/feeds/feed-chat/anonymous');
    });
  });

  describe('TESTING getAllAnonymousChannels', () => {
    it('TEST should call get with defined url and return true if status 200', async () => {
      anonymousApi.get.mockResolvedValueOnce({
        status: 200,
        data: {
          status: 200,
          data: []
        }
      });

      // Execution
      const result = await AnonymousMessageRepo.getAllAnonymousChannels();

      // Assertion
      expect(result).toEqual([]);
      expect(anonymousApi.get).toBeCalledWith('/chat/channels');
    });
  });

  describe('TESTING sendAnonymousMessage', () => {
    it('TEST should call post with defined url and return true if status 200', async () => {
      anonymousApi.post.mockResolvedValueOnce({
        status: 200,
        data: {
          status: 200,
          data: {}
        }
      });

      // Execution
      const result = await AnonymousMessageRepo.sendAnonymousMessage('channelId', 'message');

      // Assertion
      expect(result).toEqual({});
      expect(anonymousApi.post).toBeCalledWith('/chat/anonymous', {
        channelId: 'channelId',
        message: 'message'
      });
    });
  });

  describe('TESTING checkIsTargetAllowingAnonDM', () => {
    it('TEST should call post with defined url and return true if status 200', async () => {
      anonymousApi.post.mockResolvedValueOnce({
        status: 200,
        data: {
          status: 200,
          data: {}
        }
      });

      // Execution
      const result = await AnonymousMessageRepo.checkIsTargetAllowingAnonDM('userId');

      // Assertion
      expect(result).toEqual({});
      expect(anonymousApi.post).toBeCalledWith('chat/channels/check-allow-anon-dm-status', {
        members: ['userId']
      });
    });
  });
});
