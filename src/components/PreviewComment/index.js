/* eslint-disable import/no-cycle */
/* eslint-disable global-require */
import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {COLORS, FONTS, SIZES} from '../../utils/theme';
import {Dot, Gap} from '../index';
import {calculateTime} from '../../utils/time';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {getUserId} from '../../utils/users';
import CommentUserName from '../CommentUsername/CommentUsername';
import ReadMore from '../ReadMore';
import ProfilePicture from '../../screens/ProfileScreen/elements/ProfilePicture';

const PreviewComment = ({comment, time, image, totalComment, onPress, user, item}) => {
  const navigation = useNavigation();

  const openProfile = async () => {
    const selfUserId = await getUserId();

    if (item?.data?.is_anonymous) return null;

    if (selfUserId === user?.id) {
      return navigation.navigate('ProfileScreen', {
        isNotFromHomeTab: true
      });
    }
    return navigation.navigate('OtherProfile', {
      data: {
        user_id: selfUserId,
        other_id: user?.id,
        username: user?.data?.username
      }
    });
  };
  if (!user) return <></>;
  return (
    <View testID="userDefined" style={styles.containerPreview}>
      <View style={styles.lineBeforeProfile} />
      <View style={styles.container(totalComment)}>
        <TouchableOpacity style={styles.profileTouchable} onPress={openProfile}>
          <View style={{left: -16}} />
          <View style={styles.profile}>
            {item?.data?.anon_user_info_emoji_name || item?.data?.is_anonymous ? (
              <ProfilePicture
                karmaScore={item.karma_score}
                size={25}
                width={6}
                withKarma
                isAnon={true}
                anonBackgroundColor={item.data.anon_user_info_color_code}
                anonEmojiCode={item?.data?.anon_user_info_emoji_code}
              />
            ) : (
              <ProfilePicture
                karmaScore={item.karma_score}
                profilePicPath={image || require('../../assets/images/ProfileDefault.png')}
                size={25}
                width={6}
                withKarma
              />
            )}

            <View style={styles.containerUsername}>
              <CommentUserName isPreviewComment comment={item} user={user} />
              <Gap width={4} />
              <Dot size={4} color={COLORS.gray400} />
              <Gap width={4} />
              <Text style={styles.time}>{calculateTime(time).replace('ago', '')}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <ReadMore
          onPress={onPress}
          containerStyle={styles.text}
          numberLine={2}
          style={styles.text}
          text={comment}
        />
        <Gap height={4} />
      </View>
      {totalComment >= 1 && (
        <TouchableOpacity style={styles.btnMore} onPress={onPress}>
          <Text
            style={{
              color: COLORS.signed_primary,
              ...FONTS.body4
            }}>{`${totalComment} more ${totalComment > 1 ? 'replies' : 'reply'}`}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(PreviewComment);

export const styles = StyleSheet.create({
  containerPreview: {paddingHorizontal: 20},
  text: {
    marginStart: 20
  },
  lineBeforeProfile: {
    height: 9,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.gray200,
    marginLeft: 8
  },
  container: (totalComment) => ({
    borderLeftWidth: 1,
    marginHorizontal: SIZES.base - 2,
    borderLeftColor: totalComment >= 1 ? COLORS.balance_gray : COLORS.almostBlack
  }),
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(10),
    color: COLORS.gray400,
    marginLeft: SIZES.base
  },
  profile: {
    flexDirection: 'row'
    // marginLeft: -12,
  },
  time: {
    fontFamily: fonts.inter[400],
    fontSize: 10,
    color: COLORS.gray400,
    lineHeight: 12
  },
  containerUsername: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
    // marginTop: -8.5,
  },
  btnMore: {marginStart: 8},
  commenttext: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: 19.36,
    color: COLORS.greyseries
  },
  seemore: {
    color: COLORS.blue
  },
  profileTouchable: {marginLeft: -12},
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
