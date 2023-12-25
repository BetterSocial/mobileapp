import * as React from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import config from 'react-native-config';
import Share from 'react-native-share';
import InstagramIcon from '../../../assets/social-media/instagram.svg';
import TwitterIcon from '../../../assets/social-media/twitter.svg';
import ShareUtils from '../../../utils/share/index';
import {COLORS} from '../../../utils/theme';

interface LinkProps {
  username: string;
  prompt: string;
}

interface ButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

const socialShareDescription =
  "Message me on BetterSocial! It's a new, friendlier and more private social media alternative:";

const Button: React.FC<ButtonProps> = ({onPress, style, children}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]}>
      {children}
    </TouchableOpacity>
  );
};

const CopyLink: React.FC<Omit<LinkProps, 'prompt'>> = ({username}) => {
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

const InstagramButton = ({socialMessage}: {socialMessage: string}) => {
  const [hasInstagramInstalled, setHasInstagramInstalled] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      Linking.canOpenURL('instagram://').then((val) => setHasInstagramInstalled(val));
    } else {
      Share.isPackageInstalled('com.instagram.android').then(({message}) => {
        setHasInstagramInstalled(message.includes('Installed'));
      });
    }
  }, []);

  const shareInstagramStory = async () => {
    try {
      if (hasInstagramInstalled) {
        const shareOptions = {
          message: `${socialMessage}`,
          social: Share.Social.INSTAGRAM
        };
        await Share.shareSingle(shareOptions);
      } else {
        await Share.open({
          url: 'https://www.instagram.com/direct/inbox/',
          message: `${socialMessage}`
        });
      }
    } catch (error) {
      console.error({shareInstagramStory: error});
    }
  };

  return (
    <Pressable onPress={shareInstagramStory}>
      <LinearGradient
        colors={['#7024C4', '#C21975', '#C74C4D', '#E09B3D']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.instagramContainer}>
        <Text style={styles.buttonSocialMediaLabel}>IG Story</Text>
        <InstagramIcon height={16} width={16} />
      </LinearGradient>
    </Pressable>
  );
};

const LinkAndSocialMedia: React.FC<LinkProps> = ({username, prompt}) => {
  const profileURL = `${config.SHARE_URL}/u/${username}`;
  const message = prompt || socialShareDescription;
  const socialMessage = `${message}\n${profileURL}`;

  const shareTwitter = async () => {
    const shareOptions = {
      message: socialMessage,
      social: Share.Social.TWITTER,
      failOnCancel: true
    };

    try {
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.log('Error =>', error);
    }
  };

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
          <Button onPress={shareTwitter} style={styles.tweetButton}>
            <Text style={styles.buttonSocialMediaLabel}>Tweet</Text>
            <TwitterIcon height={16} width={20} />
          </Button>

          {/* <InstagramButton socialMessage={socialMessage} /> */}
          <View style={{width: 10}} />

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
    backgroundColor: COLORS.lightgrey,
    marginTop: 19,
    borderRadius: 15,
    padding: 10
  },
  linkAndSocialMediaTitle: {
    color: COLORS.signed_primary,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 12
  },
  shareStepContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10
  },
  shareStepLabel: {
    color: COLORS.signed_primary,
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
    backgroundColor: COLORS.lightgrey,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 8
  },
  copyLinkUrl: {padding: 10, flex: 1, fontWeight: '600', color: COLORS.balance_gray, fontSize: 9},
  copyLinkButtonLabel: {color: COLORS.white, fontWeight: '600', fontSize: 12},
  copyLinkButton: {alignSelf: 'center', backgroundColor: COLORS.signed_primary},
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
    color: COLORS.white,
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
  elseWhereButton: {alignSelf: 'center', flex: 1, backgroundColor: COLORS.signed_primary},
  elseWhereLabel: {color: COLORS.white, fontWeight: '600', textAlign: 'center', fontSize: 12}
});

export default LinkAndSocialMedia;
