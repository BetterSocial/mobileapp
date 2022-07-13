/* eslint-disable max-len */
import { Dimensions, StatusBar } from 'react-native';

// const statusBarHeight = StatusBar.currentHeight;
const { width, height } = Dimensions.get('screen');
console.log('height');
console.log(height);
/**
 *
 * @param {int} size - Size to be normalized according to screen size
 * @returns {int} normalized size
 */
const normalizeDimen = (size, baseReferenceScreenWidth = 375) => size * (width / baseReferenceScreenWidth);

/**
 *
 * @param {int} size - Size to be normalized according to screen size
 * @returns {int} normalized size
 */
const normalizeDimenHeight = (size, baseReferenceScreenWidth = 833) => size * (height / baseReferenceScreenWidth);

const normalizeDimenByWidth = (size, baseReferenceScreenWidth = 375) => size * (width / baseReferenceScreenWidth);

const baseSize = {
  BASE_NEXT_CONTENT_PREVIEW_HEIGHT: 164,

  DOMAIN_HEADER_HEIGHT: 48,
  DISCOVERY_HEADER_HEIGHT: 48,

  FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM: 50,
  FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT: 20,
  FEED_ACTION_BUTTON_RADIUS: 50,
  FEED_COMMENT_CONTAINER_HEIGHT: 128,
  FEED_CONTENT_LINK_MAX_HEIGHT: 460,
  FEED_HEADER_HEIGHT: 64,
  FEED_HEADER_IMAGE_RADIUS: 48,

  PROFILE_ACTION_BUTTON_RADIUS: 50,
  PROFILE_HEADER_HEIGHT: 42 + 1 /** Height Correction */,

  TOPIC_FEED_HEADER_HEIGHT: 48,
  BASE_FEED3_CURRENT_ITEM_HEIGHT: 548,
  BASE_FEED_STANDARD_CURRENT_ITEM_HEIGHT: Dimensions.get('screen').height,
  ONBOARDING_BOTTOM_OVERLAY_CONTAINER: 288,
  ONBOARDING_BOTTOM_OVERLAY_NEXT_BUTTON_SIZE: 62,
  ONBOARDING_BETTER_LOGO_HEIGHT: 213.94,
  ONBOARDING_BETTER_LOGO_WIDTH: 156,
};

const size = {
  DOMAIN_CURRENT_HEIGHT: normalizeDimenByWidth(baseSize.BASE_FEED3_CURRENT_ITEM_HEIGHT),
  DOMAIN_HEADER_HEIGHT: normalizeDimenHeight(baseSize.DOMAIN_HEADER_HEIGHT),
  DISCOVERY_HEADER_HEIGHT: baseSize.DISCOVERY_HEADER_HEIGHT,

  FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM: normalizeDimenHeight(baseSize.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM),
  FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT: normalizeDimen(baseSize.FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT),
  FEED_ACTION_BUTTON_RADIUS: normalizeDimen(baseSize.FEED_ACTION_BUTTON_RADIUS),
  FEED_CURRENT_ITEM_HEIGHT: normalizeDimenByWidth(baseSize.BASE_FEED3_CURRENT_ITEM_HEIGHT),
  FEED_COMMENT_CONTAINER_HEIGHT: normalizeDimenHeight(baseSize.FEED_COMMENT_CONTAINER_HEIGHT),
  FEED_CONTENT_LINK_MAX_HEIGHT: normalizeDimenHeight(baseSize.FEED_CONTENT_LINK_MAX_HEIGHT),
  FEED_HEADER_HEIGHT: normalizeDimenHeight(baseSize.FEED_HEADER_HEIGHT),
  FEED_HEADER_IMAGE_RADIUS: normalizeDimenHeight(baseSize.FEED_HEADER_IMAGE_RADIUS),

  PROFILE_ACTION_BUTTON_RADIUS: normalizeDimen(baseSize.PROFILE_ACTION_BUTTON_RADIUS),
  PROFILE_ITEM_HEIGHT: normalizeDimenByWidth(baseSize.BASE_FEED3_CURRENT_ITEM_HEIGHT),
  TOPIC_FEED_HEADER_HEIGHT: normalizeDimenHeight(baseSize.TOPIC_FEED_HEADER_HEIGHT),
  // TOPIC_CURRENT_ITEM_HEIGHT: (height - statusBarHeight - baseSize.TOPIC_FEED_HEADER_HEIGHT - baseSize.BASE_NEXT_CONTENT_PREVIEW_HEIGHT),
  TOPIC_CURRENT_ITEM_HEIGHT: normalizeDimenByWidth(baseSize.BASE_FEED3_CURRENT_ITEM_HEIGHT),
  // DOMAIN_CURRENT_HEIGHT: (height - statusBarHeight - baseSize.DOMAIN_HEADER_HEIGHT - baseSize.BASE_NEXT_CONTENT_PREVIEW_HEIGHT),
  // PROFILE_ITEM_HEIGHT:
  //   (bottomBarHeight = 0) => (height - statusBarHeight - baseSize.PROFILE_HEADER_HEIGHT - bottomBarHeight - baseSize.BASE_NEXT_CONTENT_PREVIEW_HEIGHT),
  // FEED_CURRENT_ITEM_HEIGHT:
  //   (bottomBarHeight) => (height - statusBarHeight - bottomBarHeight - baseSize.BASE_NEXT_CONTENT_PREVIEW_HEIGHT),

  ONBOARDING_BOTTOM_OVERLAY_CONTAINER: normalizeDimen(baseSize.ONBOARDING_BOTTOM_OVERLAY_CONTAINER),
  ONBOARDING_BOTTOM_OVERLAY_NEXT_BUTTON_SIZE: normalizeDimen(baseSize.ONBOARDING_BOTTOM_OVERLAY_NEXT_BUTTON_SIZE),
  ONBOARDING_BETTER_LOGO_HEIGHT: normalizeDimenHeight(baseSize.ONBOARDING_BETTER_LOGO_HEIGHT, 837.68),
  ONBOARDING_BETTER_LOGO_WIDTH: normalizeDimenByWidth(baseSize.ONBOARDING_BETTER_LOGO_WIDTH),
};

console.log(size.TOPIC_CURRENT_ITEM_HEIGHT);

export default {
  size,
  normalizeDimen,
};
