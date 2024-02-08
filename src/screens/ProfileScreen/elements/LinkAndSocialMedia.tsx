import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import config from 'react-native-config';
import ShareUtils from '../../../utils/share/index';
import {COLORS} from '../../../utils/theme';
import {ShareIcon} from '../../../assets';

interface LinkProps {
  username: string;
  prompt: string;
}

interface ButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps & {children: React.ReactNode}> = ({
  onPress,
  style,
  children
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]}>
      {children}
    </TouchableOpacity>
  );
};

const CopyLink: React.FC<Omit<LinkProps, 'prompt'>> = ({username}) => {
  return (
    <View style={styles.copyLinkContainer}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.copyLinkUrl}>
        {`${config.SHARE_URL}/u/${username}`}
      </Text>
    </View>
  );
};

const LinkAndSocialMedia: React.FC<LinkProps> = ({username}) => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 10,
        marginTop: 19,
        padding: 12
      }}>
      <Text style={styles.linkAndSocialMediaTitle}>Receive incognito messages anywhere!</Text>
      <Text
        style={{
          color: COLORS.gray500,
          fontWeight: '400',
          fontSize: 12,
          paddingVertical: 8,
          lineHeight: 18
        }}>
        Share your link on Insta, TikTok or elsewhere to receive compliments, questions or feedback
        from friends.
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
        <CopyLink username={username} />
        <TouchableOpacity
          onPress={() => {
            ShareUtils.shareUserLink(username);
          }}
          style={{
            backgroundColor: COLORS.signed_primary,
            height: 34,
            borderRadius: 8,
            width: '30%'
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 8,
              marginHorizontal: 10
            }}>
            <ShareIcon />
            <Text
              style={{
                fontSize: 12,
                color: COLORS.white,
                marginLeft: 8
              }}>
              Share
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linkAndSocialMediaTitle: {
    fontWeight: '500',
    fontSize: 14
  },
  buttonContainer: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copyLinkContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    width: '67%'
  },
  copyLinkUrl: {padding: 10, flex: 1, fontWeight: '600', color: COLORS.balance_gray, fontSize: 12}
});

export default LinkAndSocialMedia;
