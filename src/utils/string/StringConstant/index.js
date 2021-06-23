// Splash Screen

// Sign in
let signInScreenHumanIdBrand = 'humanID';
let signInScreenHumanIdDetail =
  'is an independent non-profit guaranteeing your privacy and anonymity. BetterSocial will receive absolutely zero personal information.';

// Onboarding - Choose Username
let onboardingChooseUsernameHeadline = 'Choose your username';
let onboardingChooseUsernameSubHeadline =
  'Ping does not require real names - just make sure your friends will find & recognize you';
let onboardingChooseUsernameBlueBoxHint =
  'Whatever your username, you will always be able to post anonymously.';
let onboardingChooseUsernameButtonStateNext = 'NEXT';
let onboardingChooseUsernameErrorCannotBeEmpty = 'Username cannot be empty';
let onboardingChooseUsernameLabelCheckingAvailability = 'Checking availability';
let onboardingChooseUsernameLabelMinimumChar = 'Username min. 3 characters';
let onboardingChooseUsernameLabelMaximumChar = 'Username maximum 15 characters';
let onboardingChooseUsernameLabelJustANumber =
  'Username cannot be just a number';
let onboardingChooseUsernameLabelUserAvailable = (username) =>
  `Congrats - ${username} is still available`;
let onboardingChooseUsernameLabelUserTaken = (username) =>
  `Sorry, ${username} has already been taken`;

// Onboarding - Local Community
let onboardingLocalCommunityHeadline = 'Find your local community';
let onboardingLocalCommunitySubHeadline =
  'Join up to two cities you call home. Locations can only be adjusted or added infrequently.';
let onboardingLocalCommunityPrimaryLocationTitle = 'Add New Location';
let onboardingLocalCommunityPrimaryLocationSubTitle =
  'Search your favorite location';
let onboardingLocalCommunitySecondaryLocationTitle = 'Add a second location';
let onboardingLocalCommunitySecondaryLocationSubTitle =
  '🏡 Home away from home? Add a second location';

// Onboarding - Topics
let onboardingTopicsHeadline = 'Pick your topics of interest';
let onboardingTopicsSubHeadline = 'Find like-minded people';
let onboardingTopicsOthersCannotSee =
  "Others cannot see which topics you're following";
let onboardingTopicsButtonStateNext = 'NEXT';
let onboardingTopicsButtonStateChooseMore = (count) => `CHOOSE ${count} MORE`;

// Component
let headerIosSkip = 'Skip';
let searchModalTitle = 'Search';
let searchModalPlaceholder = 'Search by ZIP, neighborhood or city';
let commentBoxDefaultPlaceholder = 'Add a reply';

// Wording need to be discussed :
// Splash Screen
let splashScreenDeeplinkGetProfileNotFound = (username) =>
  `${username}'s profile not found`;

export default {
  signInScreenHumanIdBrand,
  signInScreenHumanIdDetail,

  splashScreenDeeplinkGetProfileNotFound,

  onboardingChooseUsernameHeadline,
  onboardingChooseUsernameSubHeadline,
  onboardingChooseUsernameBlueBoxHint,
  onboardingChooseUsernameButtonStateNext,
  onboardingChooseUsernameErrorCannotBeEmpty,
  onboardingChooseUsernameLabelCheckingAvailability,
  onboardingChooseUsernameLabelMinimumChar,
  onboardingChooseUsernameLabelMaximumChar,
  onboardingChooseUsernameLabelJustANumber,
  onboardingChooseUsernameLabelUserAvailable,
  onboardingChooseUsernameLabelUserTaken,

  onboardingLocalCommunityHeadline,
  onboardingLocalCommunitySubHeadline,
  onboardingLocalCommunityPrimaryLocationTitle,
  onboardingLocalCommunityPrimaryLocationSubTitle,
  onboardingLocalCommunitySecondaryLocationTitle,
  onboardingLocalCommunitySecondaryLocationSubTitle,

  onboardingTopicsHeadline,
  onboardingTopicsSubHeadline,
  onboardingTopicsOthersCannotSee,
  onboardingTopicsButtonStateNext,
  onboardingTopicsButtonStateChooseMore,

  headerIosSkip,
  searchModalTitle,
  searchModalPlaceholder,
  commentBoxDefaultPlaceholder,
};
