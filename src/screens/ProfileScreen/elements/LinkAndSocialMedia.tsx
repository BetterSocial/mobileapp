/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import config from 'react-native-config';
import {colors} from '../../../utils/colors';
import InstagramIcon from '../../../assets/social-media/instagram.svg';
import TwitterIcon from '../../../assets/social-media/twitter.svg';
import ShareUtils from '../../../utils/share/index';

interface LinkProps {
  username: string;
}

interface ButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({onPress, style, children}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]}>
      {children}
    </TouchableOpacity>
  );
};

const CopyLink: React.FC<LinkProps> = ({username}) => {
  const showCopyAlert = () =>
    Alert.alert('🔗 Link Copied!', `${config.SHARE_URL}/u/${username}`, [{text: 'OK'}]);

  const handleCopyLink = () => {
    ShareUtils.copyToClipboard(username);

    showCopyAlert();
  };
  return (
    <View style={styles.copyLinkContainer}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.copyLinkUrl}>
        {`${config.SHARE_URL}/u/${username}`}
      </Text>

      <Button onPress={handleCopyLink} style={styles.copyLinkButton}>
        <Text style={styles.copyLinkButtonLabel}>Copy Link</Text>
      </Button>
    </View>
  );
};

const InstagramButton = () => (
  <LinearGradient
    colors={['#7024C4', '#C21975', '#C74C4D', '#E09B3D']}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}
    style={styles.instagramContainer}>
    <Text style={styles.buttonSocialMediaLabel}>IG Story</Text>
    <InstagramIcon height={16} width={16} />
  </LinearGradient>
);

const LinkAndSocialMedia: React.FC<LinkProps> = ({username}) => {
  return (
    <View style={styles.linkAndSocialMediaContainer}>
      <Text style={styles.linkAndSocialMediaTitle}>Receive anonymous messages anywhere:</Text>
      <View style={styles.shareStepContainer}>
        <Text style={styles.shareStepLabel}>Step 1: Copy your link</Text>
        <CopyLink username={username} />
      </View>

      <View style={styles.shareStepContainer}>
        <Text style={styles.shareStepLabel}>Step 2: Share your link</Text>

        <View style={{flexDirection: 'row'}}>
          <Button
            // tslint:disable-next-line: no-empty
            onPress={() => {}}
            style={styles.tweetButton}>
            <Text style={styles.buttonSocialMediaLabel}>Tweet</Text>
            <TwitterIcon height={16} width={20} />
          </Button>

          <InstagramButton />

          <Button
            onPress={() => {
              ShareUtils.shareUserLink(username);
            }}
            style={styles.elseWhereButton}>
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.elseWhereLabel}>
              Elsewhere
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linkAndSocialMediaContainer: {
    backgroundColor: '#F5F5F5',
    marginTop: 19,
    borderRadius: 15,
    padding: 10
  },
  linkAndSocialMediaTitle: {
    color: colors.darkBlue,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 12
  },
  shareStepContainer: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10
  },
  shareStepLabel: {
    color: colors.darkBlue,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 10
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
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 8
  },
  copyLinkUrl: {padding: 10, flex: 1, fontWeight: '600', color: colors.gray1, fontSize: 9},
  copyLinkButtonLabel: {color: colors.white, fontWeight: '600', fontSize: 12},
  copyLinkButton: {alignSelf: 'center', backgroundColor: colors.darkBlue},
  instagramContainer: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonSocialMediaLabel: {
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 6,
    fontSize: 12
  },
  tweetButton: {
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#26A7DE'
  },
  elseWhereButton: {alignSelf: 'center', flex: 1, backgroundColor: colors.darkBlue},
  elseWhereLabel: {color: colors.white, fontWeight: '600', textAlign: 'center', fontSize: 12}
});

export default LinkAndSocialMedia;
