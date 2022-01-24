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

const baseSize = {
  FEED_HEADER_HEIGHT: 64,
  FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM: 52,
  FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT: 20,
  FEED_ACTION_BUTTON_RADIUS: 50,
  FEED_COMMENT_CONTAINER_HEIGHT: 128,
  FEED_CONTENT_LINK_MAX_HEIGHT: 460,
  PROFILE_HEADER_HEIGHT: 42 + 24 /** Height Correction */,
};

const size = {
  FEED_HEADER_HEIGHT: normalizeDimen(baseSize.FEED_HEADER_HEIGHT),
  FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM: normalizeDimen(baseSize.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM),
  FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT: normalizeDimen(baseSize.FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT),
  FEED_ACTION_BUTTON_RADIUS: normalizeDimen(baseSize.FEED_ACTION_BUTTON_RADIUS),
  FEED_CURRENT_ITEM_HEIGHT:
    (bottomBarHeight) => normalizeDimen(height - baseSize.FEED_HEADER_HEIGHT - bottomBarHeight - 164),
  FEED_COMMENT_CONTAINER_HEIGHT: normalizeDimen(baseSize.FEED_COMMENT_CONTAINER_HEIGHT),
  FEED_CONTENT_LINK_MAX_HEIGHT: normalizeDimen(baseSize.FEED_CONTENT_LINK_MAX_HEIGHT),

  PROFILE_ITEM_HEIGHT:
    (bottomBarHeight = 0) => normalizeDimen(height - statusBarHeight - baseSize.PROFILE_HEADER_HEIGHT - bottomBarHeight - 164),
};

export default {
  size,
  normalizeDimen,
};
