import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {colors} from '../../../utils/colors';

const styles = StyleSheet.create({
  unreadContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bondi_blue,
    marginRight: 12,
    marginLeft: 'auto'
  },
  unreadText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Inter'
  }
});

const CustomPreviewUnreadCount = (props) => {
  let {readComment} = props;
  const handleBadgeMessage = () => {
    if (props.channel.data.channel_type === 3) {
      return (
        <>
          {props.channel.state.unreadCount && props.channel.state.unreadCount > 0 ? (
            <View style={styles.unreadContainer}>
              <Text style={styles.unreadText}>{props.channel.state.unreadCount}</Text>
            </View>
          ) : null}
        </>
      );
    }
    if (props.channel.data.channel_type === 2) {
      return null;
    }
    return (
      <>
        {props.unread > 0 ? (
          <View style={styles.unreadContainer}>
            <Text style={styles.unreadText}>{props.unread}</Text>
          </View>
        ) : null}
      </>
    );
  };

  if (props.channel.type === 'messaging' || props.channel.type === 'topics') {
    return <>{handleBadgeMessage()}</>;
  }
  if (readComment !== props.channel.totalCommentBadge) {
    if (!readComment || readComment > props.channel.totalCommentBadge) {
      readComment = 0;
    }
    const calculated = props.channel.totalCommentBadge - readComment;
    return (
      <>
        {calculated > 0 ? (
          <View style={[styles.unreadContainer, {marginLeft: 'auto', marginRight: 4}]}>
            <Text style={styles.unreadText}>{props.channel.totalCommentBadge - readComment}</Text>
          </View>
        ) : null}
      </>
    );
  }
  return null;
};

export default React.memo(CustomPreviewUnreadCount);
