import FastImage from 'react-native-fast-image';
import React from 'react';
import {Avatar} from 'stream-chat-react-native-core/src/components/Avatar/Avatar';
import {StyleSheet, View} from 'react-native';

import FeedIcon from '../../../../assets/images/feed-icon.png';

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
  }
});

const AvatarPostNotif = ({item}) => {
  const handleImage = () => {
    if (item.isAnonym) {
      return 'https://firebasestorage.googleapis.com/v0/b/bettersocial-dev.appspot.com/o/anonym.png?alt=media&token=5ffe7504-c0e7-4a0c-9cbb-3e7b7572886f';
    }
    return item.postMaker.data.profile_pic_url;
  };

  return (
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
};

export default React.memo(
  AvatarPostNotif,
  (prevProps, nextProps) => prevProps.item === nextProps.item
);
