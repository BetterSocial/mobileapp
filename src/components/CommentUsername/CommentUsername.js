import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {fonts, normalizeFontSize} from '../../utils/fonts';

const styles = StyleSheet.create({
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(12),
    color: '#828282',
    lineHeight: 14,
    marginLeft: 16
  }
});

/**
 * @typedef {Object} CommenUsernameComponentProps
 * @property {Object} comment
 * @property {Object} user
 */

/**
 *
 * @param {CommenUsernameComponentProps} props
 */

const CommentUsername = ({comment, user}) => {
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
