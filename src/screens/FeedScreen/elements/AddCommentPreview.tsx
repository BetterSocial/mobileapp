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
import BlurredLayer from './BlurredLayer';

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
              borderBottomLeftRadius: normalize(13),
              borderBottomRightRadius: normalize(13)
            }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={onPressComment}
        style={{
          paddingHorizontal: normalize(12),
          height: normalize(56),
          position: 'absolute',
          width: '100%',
          top: -3
        }}>
        <BlurredLayer
          layerOnly
          withToast={true}
          isVisible={isBlurred}
          containerStyle={{borderRadius: 12}}>
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
              placeholderTextColor={COLORS.gray410}
              textAlignVertical="center"
              pointerEvents={'none'}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: COLORS.gray110,
                borderRadius: 8,
                marginHorizontal: 8,
                paddingHorizontal: 8,
                paddingVertical: 6,
                fontSize: dimen.normalizeDimen(14),
                fontFamily: fonts.inter[400],
                lineHeight: 20,
                color: COLORS.gray410
              }}
            />
            <View style={{width: normalize(32), height: normalize(32)}}>
              <SendIcon type={CHAT_SIGNED} />
            </View>
          </View>
        </BlurredLayer>
      </TouchableOpacity>
    </TouchableOpacity>
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
    height: normalize(28),
    backgroundColor: COLORS.almostBlack,
    borderBottomLeftRadius: normalize(16),
    borderBottomRightRadius: normalize(16),
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.darkGray,
    marginTop: -1
  }
});
