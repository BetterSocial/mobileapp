import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {SIZES} from '../../utils/theme';

const styles = StyleSheet.create({
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(12),
    color: '#828282',
    lineHeight: 14,
    marginLeft: 16
  },
  previewContainer: {
    marginLeft: SIZES.base
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
      <Text style={[styles.username, styles.previewContainer]}>
        {comment.data?.anon_user_info_color_name
          ? `Anonymous ${comment.data?.anon_user_info_emoji_name}`
          : user?.data?.username}{' '}
      </Text>
    );
  }
  return (
    <Text style={styles.username}>
      {comment.data?.anon_user_info_color_name
        ? `Anonymous ${comment.data?.anon_user_info_emoji_name}`
        : user?.data?.username}{' '}
      {comment.is_you ? '(You)' : ''} {comment.is_author ? '(Post Author)' : ''} •
    </Text>
  );
};

export default CommentUsername;
