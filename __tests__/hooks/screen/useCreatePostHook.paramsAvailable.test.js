import {renderHook} from '@testing-library/react-hooks';
import service from '../../../src/service/repo/anonUserInfoRepo';
import useCreatePostHook from '../../../src/hooks/screen/useCreatePostHook';
import * as useCreatePostHookFunf from '../../../src/hooks/screen/useCreatePostHook';

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useRoute: () => ({
    params: {
      topic: 'TopicName'
    }
  })
}));

describe('Testing UseCreatePostHook', () => {
  beforeAll(() => {
    jest
      .spyOn(service, 'getPostAnonUserInfo')
      .mockResolvedValue({isSuccess: true, data: {colorCode: '123', colorName: 'green'}});
  });
  it('should return headerTitle and initialTopic if provided', () => {
    const {headerTitle, initialTopic} = renderHook(() => useCreatePostHook()).result.current;
    expect(headerTitle).toBe('Create Post in #TopicName');
    expect(initialTopic).toEqual(['TopicName']);
  });

  it('getAnonUser success response should run correctly', async () => {
    const mock = jest.spyOn(service, 'getPostAnonUserInfo');
    const mockResponse = {isSuccess: true, data: {name: 'agiat'}};
    jest.spyOn(useCreatePostHookFunf, 'default').mockImplementation(() => ({
      getAnonUserInfo: jest.fn().mockResolvedValue(mockResponse)
    }));
    const {getAnonUserInfo} = renderHook(() => useCreatePostHook()).result.current;
    const response = await getAnonUserInfo();
    expect(mock).toHaveBeenCalled();
    expect(response).toEqual(mockResponse);
  });
});
