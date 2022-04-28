// Splash Screen

// Sign in
const signInScreenHumanIdBrand = 'humanID';
const signInScreenHumanIdDetail = 'is an independent non-profit guaranteeing\n your privacy. BetterSocial will receive absolutely zero\n personal information.';

// Onboarding - Choose Username
const onboardingChooseUsernameHeadline = 'Choose your username';
const onboardingChooseUsernameSubHeadline = 'BetterSocial does not require real names - just make sure your friends will find & recognize you';
const onboardingChooseUsernameBlueBoxHint = 'Whatever your username, you will always be able to post anonymously.';
const onboardingChooseUsernameButtonStateNext = 'NEXT';
const onboardingChooseUsernameErrorCannotBeEmpty = 'Username cannot be empty';
const onboardingChooseUsernameLabelCheckingAvailability = 'Checking availability';
const onboardingChooseUsernameLabelMinimumChar = 'Username min. 3 characters';
const onboardingChooseUsernameLabelMaximumChar = 'Username maximum 15 characters';
const onboardingChooseUsernameLabelJustANumber = 'Username cannot be just a number';
const onboardingChooseUsernameLabelUserAvailable = (username) => `Congrats - ${username} is still available`;
const onboardingChooseUsernameLabelUserTaken = (username) => `Sorry, ${username} has already been taken`;

// Onboarding - Local Community
const onboardingLocalCommunityHeadline = 'Find your local community';
const onboardingLocalCommunitySubHeadline = 'Join up to two cities you call home. Locations can only be adjusted or added infrequently.';
const onboardingLocalCommunityPrimaryLocationTitle = 'Add New Location';
const onboardingLocalCommunityPrimaryLocationSubTitle = 'Search your favorite location';
const onboardingLocalCommunitySecondaryLocationTitle = 'Add a second location';
const onboardingLocalCommunitySecondaryLocationSubTitle = '🏡 Home away from home? Add a second location';

// Onboarding - Topics
const onboardingTopicsHeadline = 'Pick your topics of interest';
const onboardingTopicsSubHeadline = 'Find like-minded people';
const onboardingTopicsOthersCannotSee = "Others cannot see which topics you're following";
const onboardingTopicsButtonStateNext = 'NEXT';
const onboardingTopicsButtonStateChooseMore = (count) => `CHOOSE ${count} MORE`;

// Post Detail Page
const postDetailPageSeeReplies = (count) => `See ${count} ${count > 1 ? 'replies' : 'reply'}`;

// Create Post
const createPostDone = 'Your post was successfully published.';
const createPostFailedNoMessage = 'Post messages cannot be empty.';
const createPostFailedGeneralError = 'Failed to create new post.';

// Chat Tab
const chatTabHeaderPlaceholder = 'Search Users';
const chatTabHeaderCreateChatButtonText = 'New Chat';

// News Tab
const newsTabHeaderPlaceholder = 'Search Better';
const newsTabHeaderCreatePostButtonText = 'New Post';

// Link Detail Page
const linkDetailPageOpenInBrowser = 'Open in browser';

// Component
const headerIosSkip = 'Skip';
const searchModalTitle = 'Search';
const searchModalPlaceholder = 'Search by ZIP, neighborhood or city';
const commentBoxDefaultPlaceholder = 'Add your reply';

// General
const generalAnonymousText = 'Anonymous';

// Wording need to be discussed :
// Splash Screen
const splashScreenDeeplinkGetProfileNotFound = (username) => `${username}'s profile not found`;

// Domain Page
const domainCannotOpenURL = 'Cannot open URL';
const credderTooltipText = 'Credder.com is the world\'s largest news review platform. The credibility score is based on reviews by verified journalits.\nCredder & Better are entirely independent entities and Better has no influence on the scores provided.';

// Permission
const cameraPermissionGranted = 'You can use camera';
const cameraPermissionDenied = 'Camera permission denied';
const cameraPermissionUnavailable = 'The camera feature is not available on this device';
const externalStoragePermissionGranted = 'External storage permission denied';
const externalStoragePermissionDenied = 'External storage permission denied';
const externalStoragePermissionUnavailable = 'The external storage feature is not available on this device';

// Contact screen
const failedCreateChannel = 'Couldn’t create chat. Please try again.';

// Feed Footer
const downvoteFailedText = 'Downvote failed - please try again';
const upvoteFailedText = 'Upvote failed - please try again';

// Discovery Screen
const discoveryMoreUsers = 'More Users';
const discoveryMoreTopics = 'More Topics';
const discoveryMoreDomains = 'More Domains';
const discoveryMoreNews = 'More News';
const discoverySearchBarPlaceholder = 'Search Better';

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
  credderTooltipText,

  cameraPermissionGranted,
  cameraPermissionDenied,
  cameraPermissionUnavailable,
  externalStoragePermissionDenied,
  externalStoragePermissionGranted,
  externalStoragePermissionUnavailable,

  failedCreateChannel,

  downvoteFailedText,
  upvoteFailedText,

  discoveryMoreUsers,
  discoveryMoreTopics,
  discoveryMoreDomains,
  discoveryMoreNews,
  discoverySearchBarPlaceholder,
};
