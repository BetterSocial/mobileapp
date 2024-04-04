import React, {useContext} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Context} from '../../../context';
import {COLORS} from '../../../utils/theme';
import ProfilePicture from '../../ProfileScreen/elements/ProfilePicture';
import SendIcon from '../../../components/SendIcon';
import {CHAT_SIGNED} from '../../../utils/constants';
import StringConstant from '../../../utils/string/StringConstant';
import {fonts, normalize} from '../../../utils/fonts';
import dimen from '../../../utils/dimen';

type AddCommentPreviewProps = {
  isBlurred: boolean;
  onPressComment: () => void;
  isShortText: boolean;
};

function AddCommentPreview({
  isBlurred,
  onPressComment,
  isShortText = false
}: AddCommentPreviewProps) {
  const [profile] = (useContext(Context) as unknown as any).profile;
  return (
    !isBlurred && (
      <TouchableOpacity testID="writeComment" onPress={onPressComment}>
        <View style={styles.floatBackground}>
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
          onPress={onPressComment}
          style={{
            paddingHorizontal: 12,
            height: 56,
            position: 'absolute',
            width: '100%'
          }}>
          <View style={styles.profile}>
            <View testID="userDefined">
              <ProfilePicture
                karmaScore={profile.myProfile.karma_score}
                size={25}
                width={4}
                withKarma
                isAnon={profile.myProfile.is_anonymous}
                profilePicPath={profile.myProfile.profile_pic_path}
                anonBackgroundColor={''}
                anonEmojiCode={''}
              />
            </View>
            <TextInput
              placeholder={StringConstant.commentBoxDefaultPlaceholder}
              placeholderTextColor={COLORS.blackgrey}
              textAlignVertical="center"
              pointerEvents={'none'}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: COLORS.grey110,
                borderRadius: 8,
                marginHorizontal: 8,
                paddingHorizontal: 8,
                paddingVertical: 6,
                fontSize: dimen.normalizeDimen(14),
                fontFamily: fonts.inter[400],
                lineHeight: 20,
                color: COLORS.grey410
              }}
            />
            <View style={{width: normalize(32), height: normalize(32)}}>
              <SendIcon type={CHAT_SIGNED} />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  );
}

export default AddCommentPreview;

export const styles = StyleSheet.create({
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
  floatBackground: {
    height: 28,
    backgroundColor: COLORS.almostBlack,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.darkGray
  }
});
