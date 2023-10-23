export const mockAnonymousApiPost = jest.fn();
export const mockAnonymousApiGet = jest.fn();

const anonymousApi = {
  post: jest.fn(),
  get: jest.fn()
};

export default anonymousApi;
