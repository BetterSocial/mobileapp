// Splash Screen

// Sign in
let signInScreenHumanIdBrand = 'humanID';
let signInScreenHumanIdDetail =
  'is an independent non-profit guaranteeing your privacy and anonymity. BetterSocial will receive absolutely zero personal information.';

// Onboarding - Choose Username
let onboardingChooseUsernameHeadline = 'Choose your username';
let onboardingChooseUsernameSubHeadline =
  'BetterSocial does not require real names - just make sure your friends will find & recognize you';
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

// Post Detail Page
let postDetailPageSeeReplies = (count) => {
  return `See ${count} ${count > 1 ? 'replies' : 'reply'}`;
};

// Create Post
let createPostDone = 'Your post was shared.';
let createPostFailedNoMessage = 'Post messages cannot be empty.';
let createPostFailedGeneralError = 'Failed to create new post.';

// Chat Tab
let chatTabHeaderPlaceholder = 'Search Chat';
let chatTabHeaderCreateChatButtonText = 'New Chat';

// News Tab
let newsTabHeaderPlaceholder = 'Search Better';
let newsTabHeaderCreatePostButtonText = 'New Post';

// Link Detail Page
let linkDetailPageOpenInBrowser = 'Open in browser';

// Component
let headerIosSkip = 'Skip';
let searchModalTitle = 'Search';
let searchModalPlaceholder = 'Search by ZIP, neighborhood or city';
let commentBoxDefaultPlaceholder = 'Add your reply';

// General
let generalAnonymousText = 'Anonymous';

// Wording need to be discussed :
// Splash Screen
let splashScreenDeeplinkGetProfileNotFound = (username) =>
  `${username}'s profile not found`;

// Domain Page
let domainCannotOpenURL = 'Cannot open URL';

// Permission
let cameraPermissionGranted = 'You can use camera';
let cameraPermissionDenied = 'Camera permission denied';
let cameraPermissionUnavailable =
  'The camera feature is not available on this device';
let externalStoragePermissionGranted = 'External storage permission denied';
let externalStoragePermissionDenied = 'External storage permission denied';
let externalStoragePermissionUnavailable =
  'The external storage feature is not available on this device';

// Contact screen
let failedCreateChannel = 'Couldn’t create chat. Please try again.';

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

  postDetailPageSeeReplies,

  createPostDone,
  createPostFailedNoMessage,
  createPostFailedGeneralError,

  chatTabHeaderPlaceholder,
  chatTabHeaderCreateChatButtonText,

  newsTabHeaderPlaceholder,
  newsTabHeaderCreatePostButtonText,

  linkDetailPageOpenInBrowser,

  headerIosSkip,
  searchModalTitle,
  searchModalPlaceholder,
  commentBoxDefaultPlaceholder,

  generalAnonymousText,

  domainCannotOpenURL,

  cameraPermissionGranted,
  cameraPermissionDenied,
  cameraPermissionUnavailable,
  externalStoragePermissionDenied,
  externalStoragePermissionGranted,
  externalStoragePermissionUnavailable,

  failedCreateChannel,
};
