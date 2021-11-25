import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {COLORS, FONTS, SIZES} from '../../utils/theme';
import {Dot, Gap} from '../../components';
import {calculateTime} from '../../utils/time';
import {fonts} from '../../utils/fonts';
import {getUserId} from '../../utils/users';

const PreviewComment = ({
  comment,
  time,
  image,
  totalComment,
  onPress,
  user,
}) => {
  const navigation = useNavigation();

  let openProfile = async () => {
    let selfUserId = await getUserId();
    if (selfUserId === user.id) {
      return navigation.navigate('ProfileScreen');
    }
    return navigation.navigate('OtherProfile', {
      data: {
        user_id: selfUserId,
        other_id: user.id,
        username: user.data.username,
      },
    });
  };

  return (
    <View style={styles.containerPreview}>
      <View style={styles.lineBeforeProfile} />
      <View style={styles.container(totalComment)}>
        <TouchableOpacity style={styles.profileTouchable} onPress={openProfile}>
          <View style={{left: -16}} />
          <View style={styles.profile}>
            <Image
              source={
                image
                  ? {uri: image, cache: 'reload'}
                  : require('../../assets/images/ProfileDefault.png')
              }
              loadingIndicatorSource={
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: 'white',
                    borderRadius: 12,
                  }}
                />
              }
              style={styles.image}
            />
            <View style={styles.containerUsername}>
              <Text style={styles.username}>{user.data.username}</Text>
              <Gap width={4} />
              <Dot size={4} color={'#828282'} />
              <Gap width={4} />
              <Text style={styles.time}>
                {calculateTime(time).replace('ago', '')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.text}>
          {/* <SeeMore seeMoreText={'More'} seeLessText={'Less'} numberOfLines={2}>
            {comment}
          </SeeMore> */}
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.commenttext}>
              {`${comment.substring(0, 100).trim()} `}
              {comment.length > 100 ? (
                <Text style={styles.seemore}>more</Text>
              ) : (
                <></>
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <Gap height={SIZES.base} />
      </View>
      {totalComment >= 1 && (
        <TouchableOpacity style={styles.btnMore} onPress={onPress}>
          <Text
            style={{
              color: COLORS.blue,
              ...FONTS.body4,
            }}>{`${totalComment} more ${
            totalComment > 1 ? 'replies' : 'reply'
          }`}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PreviewComment;

const styles = StyleSheet.create({
  containerPreview: {paddingHorizontal: 20},
  text: {
    marginStart: 20,
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  lineBeforeProfile: {
    height: 9,
    borderLeftWidth: 1,
    borderLeftColor: '#C4C4C4',
    marginLeft: 8,
  },
  container: (totalComment) => ({
    borderLeftWidth: 1,
    marginHorizontal: SIZES.base,
    borderLeftColor: totalComment >= 1 ? '#C4C4C4' : '#fff',
  }),
  username: {
    fontFamily: fonts.inter[700],
    fontSize: 12,
    color: '#828282',
    marginLeft: SIZES.base,
  },
  profile: {
    flexDirection: 'row',
    // marginLeft: -12,
  },
  time: {
    fontFamily: fonts.inter[400],
    fontSize: 10,
    color: '#828282',
    lineHeight: 12,
  },
  containerUsername: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    // marginTop: -8.5,
  },
  btnMore: {marginStart: 8},
  commenttext: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 19.36,
    color: COLORS.greyseries,
  },
  seemore: {
    color: COLORS.blue,
  },
  profileTouchable: {marginLeft: -12},
});
