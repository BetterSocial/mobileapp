import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
import {COLORS, SIZES} from '../../utils/theme';
import {calculateTime} from '../../utils/time';
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';
import {getUserId} from '../../utils/users';
import CommentUserName from '../CommentUsername/CommentUsername';
import ReadMore from '../ReadMore';
import ProfilePicture from '../../screens/ProfileScreen/elements/ProfilePicture';

const PreviewComment = ({comment, time, image, totalComment, onPress, user, item, isShortText}) => {
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
    <View>
      <View
        style={{
          height: normalize(28),
          backgroundColor: COLORS.almostBlack,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderColor: COLORS.darkGray,
          marginTop: -1
        }}>
        {isShortText && (
          <LinearGradient
            colors={['#275D8A', '#275D8A']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12
            }}
          />
        )}
      </View>
      <TouchableOpacity
        style={{
          paddingHorizontal: 12,
          height: normalize(56),
          position: 'absolute',
          width: '100%'
        }}
        onPress={onPress}>
        <View testID="userDefined" style={styles.profile}>
          <TouchableOpacity onPress={openProfile}>
            {item?.data?.anon_user_info_emoji_name || item?.data?.is_anonymous ? (
              <ProfilePicture
                karmaScore={item.karma_score}
                size={20}
                width={4}
                withKarma
                isAnon={true}
                anonBackgroundColor={item.data.anon_user_info_color_code}
                anonEmojiCode={item?.data?.anon_user_info_emoji_code}
              />
            ) : (
              <ProfilePicture
                karmaScore={item.karma_score}
                profilePicPath={image}
                size={25}
                width={4}
                withKarma
              />
            )}
          </TouchableOpacity>
          <View style={{flexDirection: 'column'}}>
            <TouchableOpacity onPress={openProfile} style={styles.containerUsername}>
              <CommentUserName isPreviewComment comment={item} user={user} />
              <View style={styles.point} />
              <Text style={styles.time}>{calculateTime(time).replace('ago', '')}</Text>
            </TouchableOpacity>
            <ReadMore onPress={onPress} text={comment} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(PreviewComment);

export const styles = StyleSheet.create({
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(10),
    color: COLORS.gray410,
    marginLeft: SIZES.base
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.almostBlack,
    padding: 12,
    borderRadius: 12,
    borderColor: COLORS.darkGray2,
    borderWidth: 1,
    shadowColor: COLORS.black000,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3
  },
  time: {
    fontFamily: fonts.inter[400],
    fontSize: 10,
    color: COLORS.gray410,
    lineHeight: 12
  },
  containerUsername: {
    alignItems: 'center',
    flexDirection: 'row'
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
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  point: {
    width: 2,
    height: 2,
    borderRadius: 4,
    backgroundColor: COLORS.gray410,
    marginHorizontal: 6,
    alignSelf: 'center',
    marginTop: 0
  }
});
