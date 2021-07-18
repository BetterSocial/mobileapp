import * as React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';

import MemoIc_read from '../../assets/chats/Ic_read';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {calculateTime} from '../../utils/time';
import Dot from '../Dot';
import ProfileMessage from './ProfileMessage';
const MessageWithEmage = ({
  image,
  name,
  time,
  message,
  read,
  isMe,
  attachments,
}) => {
  return (
    <View style={styles.container}>
      <ProfileMessage image={image} />
      <View style={styles.containerChat(isMe)}>
        <View style={styles.user}>
          <View style={styles.userDetail}>
            <Text style={styles.name}>{name}</Text>
            <Dot color="#000" />
            <Text style={styles.time}>{calculateTime(time)}</Text>
          </View>
          <MemoIc_read
            width={14.9}
            height={8.13}
            fill={read ? colors.bondi_blue : colors.gray}
          />
        </View>
        <Text style={styles.message}>{message}</Text>
        <ShowImage images={attachments} />
      </View>
    </View>
  );
};

export default MessageWithEmage;

const ShowImage = React.memo(({images}) => {
  console.log('image render ');
  if (images.length <= 3) {
    return (
      <FlatList
        data={images}
        renderItem={({item, index}) => {
          return (
            <Image
              key={'sg' + index}
              style={styles.singleImage}
              source={{
                uri: item.asset_url,
              }}
              resizeMode="cover"
            />
          );
        }}
      />
    );
  }
  if (images.length >= 4) {
    return (
      <FlatList
        data={images}
        style={styles.flexlist}
        contentContainerStyle={styles.containerManyEmage}
        numColumns={2}
        keyExtractor={(i, key) => 'mn' + key}
        renderItem={({item, index}) => {
          return (
            <Image
              key={'mn' + index}
              style={[styles.manyImage, styles.manyImageItem(index)]}
              source={{uri: item.asset_url}}
              resizeMode="cover"
            />
          );
        }}
      />
    );
  }

  return null;
});

const styles = StyleSheet.create({
  singleImage: {
    flex: 1,
    width: '100%',
    height: 295,
    marginVertical: 4,
    borderRadius: 8,
  },
  flexlist: {backgroundColor: '#fff', borderRadius: 8},
  containerManyEmage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  manyImage: {
    flex: 2,
    width: 145.76,
    height: 145.76,
  },
  manyImageItem: (i) => {
    if (i === 0) {
      return {
        borderTopLeftRadius: 8,
        marginBottom: 3.47,
        marginRight: 3.47,
      };
    }
    if (i === 1) {
      return {
        borderTopRightRadius: 8,
      };
    }
    if (i === 2) {
      return {
        borderBottomLeftRadius: 8,
        marginRight: 3.47,
      };
    }
    if (i === 3) {
      return {
        borderBottomRightRadius: 8,
      };
    }
  },
  name: {
    fontSize: 12,
    fontFamily: fonts.inter[600],
    lineHeight: 14.53,
    color: '#000',
    marginRight: 5.7,
  },
  time: {
    fontSize: 10,
    fontFamily: fonts.inter[600],
    lineHeight: 12,
    color: '#000',
    marginLeft: 5,
  },
  message: {
    color: '#000',
    marginTop: 4,
    fontSize: 16,
    fontFamily: fonts.inter[400],
    lineHeight: 19.36,
    marginLeft: 4,
    marginRight: 5.35,
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 20,
  },
  containerChat: (isMe) => ({
    backgroundColor: isMe ? colors.halfBaked : colors.lightgrey,
    paddingVertical: 8,
    paddingHorizontal: 4,
    flex: 1,
    borderRadius: 8,
    marginVertical: 4,
    marginLeft: 8,
  }),
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDetail: {flexDirection: 'row', alignItems: 'center'},
});
