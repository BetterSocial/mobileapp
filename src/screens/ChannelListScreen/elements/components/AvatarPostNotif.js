import FastImage from 'react-native-fast-image';
import React from 'react';
import {Avatar} from 'stream-chat-react-native-core/src/components/Avatar/Avatar';
import {StyleSheet, Text, View} from 'react-native';

import FeedIcon from '../../../../assets/images/feed-icon.png';
import dimen from '../../../../utils/dimen';

const styles = StyleSheet.create({
  iconStyle: {
    height: 12,
    width: 12
  },
  iconContainerStyle: {
    backgroundColor: '#55C2FF'
  },
  typeContainer: {
    height: 24,
    width: 24,
    backgroundColor: '#55C2FF',
    borderRadius: 12,
    position: 'absolute',
    bottom: -6,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: 'white'
  },
  avatarAnonymous: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24
  },
  emojiStyle: {
    fontSize: dimen.size.FEED_HEADER_ANONYMOUS_IMAGE_RADIUS
  }
});

const AvatarPostNotif = ({item}) => {
  const handleImage = () => {
    if (item.isAnonym) {
      return 'https://firebasestorage.googleapis.com/v0/b/bettersocial-dev.appspot.com/o/anonym.png?alt=media&token=5ffe7504-c0e7-4a0c-9cbb-3e7b7572886f';
    }
    return item.postMaker.data.profile_pic_url;
  };

  const handleAvatar = () => (
    <Avatar
      childrenType={
        <View style={styles.typeContainer}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={FeedIcon}
            style={styles.iconStyle}
          />
        </View>
      }
      showType={true}
      size={48}
      image={handleImage()}
    />
  );

  if (item.isAnonym) {
    if (!item.postMaker?.data?.emoji_code) {
      return <>{handleAvatar()}</>;
    }
    return (
      <View style={[styles.avatarAnonymous, {backgroundColor: item.postMaker?.data?.color_code}]}>
        <Text style={styles.emojiStyle}>{item.postMaker?.data?.emoji_code}</Text>
      </View>
    );
  }

  return <>{handleAvatar()}</>;
};

export default React.memo(
  AvatarPostNotif,
  (prevProps, nextProps) => prevProps.item === nextProps.item
);
