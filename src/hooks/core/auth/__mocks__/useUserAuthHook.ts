const mockSignedProfile = {
  username: 'JohnDoe',
  profile_pic_path:
    'https://res.cloudinary.com/hpjivutj2/image/upload/v1680929851/default-profile-picture_vrmmdn.png'
};

const signedProfileId = 'signedProfileId';
const anonProfileId = 'anonProfileId';
const token = 'token';
const anonymousToken = 'anonymousToken';

const useUserAuthHook = {
  profile: mockSignedProfile,
  signedProfileId,
  anonProfileId,
  token,
  anonymousToken,
  reset: jest.fn(),
  setAuth: jest.fn()
};

export default useUserAuthHook;
