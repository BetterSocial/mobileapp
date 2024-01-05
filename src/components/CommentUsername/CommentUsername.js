import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {COLORS, SIZES} from '../../utils/theme';
import dimen from '../../utils/dimen';

const styles = StyleSheet.create({
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(12),
    color: COLORS.blackgrey,
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
    color: '#828282'
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
          ? `Anonymous ${comment.data?.anon_user_info_emoji_name}`
          : user?.data?.username}{' '}
      </Text>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.username}>
        {comment.data?.anon_user_info_color_name
          ? `Anonymous ${comment.data?.anon_user_info_emoji_name}`
          : user?.data?.username}{' '}
        {comment.is_you ? '(You)' : ''} {comment.is_author ? '(Post Author)' : ''}
      </Text>
      <Text style={styles.dot}> •</Text>
    </View>
  );
};

export default CommentUsername;
