/* eslint-disable max-len */
import { Dimensions, StatusBar } from 'react-native';

const statusBarHeight = StatusBar.currentHeight;
const { width, height } = Dimensions.get('screen');
/**
 *
 * @param {int} size - Size to be normalized according to screen size
 * @returns {int} normalized size
 */
const normalizeDimen = (size) => {
  const baseReferenceScreenWidth = 375;
  return size * (width / baseReferenceScreenWidth);
};

/**
 *
 * @param {int} size - Size to be normalized according to screen size
 * @returns {int} normalized size
 */
const normalizeDimenHeight = (size) => {
  const baseReferenceScreenWidth = 833;
  return size * (height / baseReferenceScreenWidth);
};

const baseSize = {
  BASE_NEXT_CONTENT_PREVIEW_HEIGHT: 164,
  FEED_HEADER_HEIGHT: 64,
  FEED_HEADER_IMAGE_RADIUS: 48,
  FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM: 50,
  FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT: 20,
  FEED_ACTION_BUTTON_RADIUS: 50,
  PROFILE_ACTION_BUTTON_RADIUS: 50,
  FEED_COMMENT_CONTAINER_HEIGHT: 128,
  FEED_CONTENT_LINK_MAX_HEIGHT: 460,
  PROFILE_HEADER_HEIGHT: 42 + 1 /** Height Correction */,
};

const size = {
  FEED_HEADER_HEIGHT: normalizeDimenHeight(baseSize.FEED_HEADER_HEIGHT),
  FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM: normalizeDimenHeight(baseSize.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM),
  FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT: normalizeDimen(baseSize.FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT),
  FEED_ACTION_BUTTON_RADIUS: normalizeDimen(baseSize.FEED_ACTION_BUTTON_RADIUS),
  FEED_HEADER_IMAGE_RADIUS: normalizeDimenHeight(baseSize.FEED_HEADER_IMAGE_RADIUS),
  PROFILE_ACTION_BUTTON_RADIUS: normalizeDimen(baseSize.PROFILE_ACTION_BUTTON_RADIUS),
  FEED_CURRENT_ITEM_HEIGHT:
    (bottomBarHeight) => (height - statusBarHeight - bottomBarHeight - baseSize.BASE_NEXT_CONTENT_PREVIEW_HEIGHT),
  FEED_COMMENT_CONTAINER_HEIGHT: normalizeDimenHeight(baseSize.FEED_COMMENT_CONTAINER_HEIGHT),
  FEED_CONTENT_LINK_MAX_HEIGHT: normalizeDimenHeight(baseSize.FEED_CONTENT_LINK_MAX_HEIGHT),

  PROFILE_ITEM_HEIGHT:
    (bottomBarHeight = 0) => (height - statusBarHeight - baseSize.PROFILE_HEADER_HEIGHT - bottomBarHeight - baseSize.BASE_NEXT_CONTENT_PREVIEW_HEIGHT),
};

export default {
  size,
  normalizeDimen,
};
