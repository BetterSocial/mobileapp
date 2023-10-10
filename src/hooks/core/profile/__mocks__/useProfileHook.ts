const mockSignedProfile = {
  username: 'JohnDoe',
  profile_pic_path:
    'https://res.cloudinary.com/hpjivutj2/image/upload/v1680929851/default-profile-picture_vrmmdn.png'
};

const signedProfileId = 'signedProfileId';
const anonProfileId = 'anonProfileId';

const useProfileHook = {
  profile: mockSignedProfile,
  signedProfileId,
  anonProfileId,
  setProfileId: jest.fn()
};

export default useProfileHook;
