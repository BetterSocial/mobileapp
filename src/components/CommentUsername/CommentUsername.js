import React from 'react';
import {StyleSheet, Text} from 'react-native';

import dimen from '../../utils/dimen';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {getOfficialAnonUsername} from '../../utils/string/StringUtils';
import {COLORS, SIZES} from '../../utils/theme';

const styles = StyleSheet.create({
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(12),
    color: COLORS.white,
    lineHeight: 14,
    marginLeft: 16,
    maxWidth: dimen.normalizeDimen(170)
  },
  previewContainer: {
    marginLeft: SIZES.base
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dot: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(12),
    color: COLORS.gray400
  }
});

/**
 * @typedef {Object} CommenUsernameComponentProps
 * @property {Object} comment
 * @property {Object} user
 * @property {boolean} isPreviewComment
 */

/**
 *
 * @param {CommenUsernameComponentProps} props
 */

const CommentUsername = ({comment, user, isPreviewComment}) => {
  if (isPreviewComment) {
    return (
      <Text style={[styles.username, styles.previewContainer]} numberOfLines={1}>
        {comment.data?.anon_user_info_color_name
          ? getOfficialAnonUsername(comment?.data)
          : user?.data?.username}{' '}
      </Text>
    );
  }
  return (
    <Text style={styles.username}>
      {comment.data?.anon_user_info_color_name
        ? getOfficialAnonUsername(comment?.data)
        : user?.data?.username}{' '}
      {comment.is_you ? '(You)' : ''} {comment.is_author ? '(Post Author)' : ''}{' '}
      <Text style={styles.dot}>•</Text>
    </Text>
  );
};

export default CommentUsername;
