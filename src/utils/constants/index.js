const ANALYTICS_SHARE_POST_FEED_ID = 'btn_share';
const ANALYTICS_SHARE_POST_FEED_SCREEN = 'feed_screen_btn_share';
const ANALYTICS_SHARE_POST_PDP_SCREEN = 'pdp_screen_btn_share';
const ANALYTICS_SHARE_POST_PROFILE_ID = 'btn_share';
const ANALYTICS_SHARE_POST_PROFILE_SCREEN = 'profile_screen_btn_share';
const ANALYTICS_SHARE_POST_TOPIC_ID = 'btn_share';
const ANALYTICS_SHARE_POST_TOPIC_SCREEN = 'topic_screen_btn_share';
const CHANNEL_TYPE_GROUP = 1;
const CHANNEL_TYPE_GROUP_LOCATION = 2;
const CHANNEL_TYPE_PERSONAL = 0;
const CHANNEL_TYPE_TOPIC = 3;
const DEFAULT_PROFILE_PIC_PATH =
  'https://res.cloudinary.com/hpjivutj2/image/upload/v1680929851/default-profile-picture_vrmmdn.png';
const DEFAULT_TOPIC_PIC_PATH =
  'https://res.cloudinary.com/hpjivutj2/image/upload/v1636632905/vdg8solozeepgvzxyfbv.png';
const KEY_ACCESS_TOKEN = 'access_token';
const KEY_REFRESH_TOKEN = 'refresh_token';
const MAX_POLLING_ALLOWED = 4;
const MAX_POLLING_CHARACTER_ALLOWED = 25;
const MIN_POLLING_ALLOWED = 2;
const POST_TYPE_LINK = 2;
const POST_TYPE_POLL = 1;
const POST_TYPE_STANDARD = 0;
const POST_VERB_LINK = 'link';
const POST_VERB_POLL = 'poll';
const POST_VERB_STANDARD = 'tweet';
const FEED_CHAT_KEY = 'feed_chats';

const DISCOVERY_TAB_USERS = 0;
const DISCOVERY_TAB_TOPICS = 1;
const DISCOVERY_TAB_DOMAINS = 2;
const DISCOVERY_TAB_NEWS = 3;

const SOURCE_FEED_TAB = 'feed tab';
const SOURCE_PDP = 'PDP';
const SOURCE_MY_PROFILE = 'my profile';

const PRIVACY_PUBLIC = 'public';
const PRIVACY_PEOPLE_I_FOLLOW = 'people_i_follow';

const ENABLE_DEV_ONLY_FEATURE = true;

const PREFIX_TOPIC = 'topic_';

const POST_CHECK_FEED_NOT_FOUND = 1;
const POST_CHECK_AUTHOR_NOT_FOLLOWING = 2;
const POST_CHECK_FEED_EXPIRED = 3;
const POST_CHECK_AUTHOR_BLOCKED = 4;

const NavigationConstants = {
  CREATE_POST_SCREEN: 'CreatePost'
};

const POST_VERSION = 2;

export {
  ANALYTICS_SHARE_POST_FEED_ID,
  ANALYTICS_SHARE_POST_FEED_SCREEN,
  ANALYTICS_SHARE_POST_PDP_SCREEN,
  ANALYTICS_SHARE_POST_PROFILE_ID,
  ANALYTICS_SHARE_POST_PROFILE_SCREEN,
  ANALYTICS_SHARE_POST_TOPIC_ID,
  ANALYTICS_SHARE_POST_TOPIC_SCREEN,
  CHANNEL_TYPE_GROUP_LOCATION,
  CHANNEL_TYPE_GROUP,
  CHANNEL_TYPE_PERSONAL,
  CHANNEL_TYPE_TOPIC,
  DEFAULT_PROFILE_PIC_PATH,
  DEFAULT_TOPIC_PIC_PATH,
  DISCOVERY_TAB_DOMAINS,
  DISCOVERY_TAB_NEWS,
  DISCOVERY_TAB_TOPICS,
  DISCOVERY_TAB_USERS,
  ENABLE_DEV_ONLY_FEATURE,
  KEY_ACCESS_TOKEN,
  KEY_REFRESH_TOKEN,
  MAX_POLLING_ALLOWED,
  MAX_POLLING_CHARACTER_ALLOWED,
  MIN_POLLING_ALLOWED,
  SOURCE_FEED_TAB,
  SOURCE_PDP,
  SOURCE_MY_PROFILE,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
  POST_VERB_LINK,
  POST_VERB_POLL,
  POST_VERB_STANDARD,
  POST_VERSION,
  PRIVACY_PEOPLE_I_FOLLOW,
  PRIVACY_PUBLIC,
  PREFIX_TOPIC,
  POST_CHECK_FEED_NOT_FOUND,
  POST_CHECK_AUTHOR_NOT_FOLLOWING,
  POST_CHECK_FEED_EXPIRED,
  POST_CHECK_AUTHOR_BLOCKED,
  FEED_CHAT_KEY,
  NavigationConstants
};
