import * as React from 'react';
import {Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import config from 'react-native-config';
import SimpleToast from 'react-native-simple-toast';
import {colors} from '../../../utils/colors';
import InstagramIcon from '../../../assets/social-media/instagram.svg';
import TwitterIcon from '../../../assets/social-media/twitter.svg';
import ShareUtils from '../../../utils/share/index';

interface LinkProps {
  username: string;
}

const Button: React.FC<{onPress: () => void; color: string; styles?: ViewStyle}> = ({
  onPress,
  color,
  styles,
  children
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 8,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        ...styles
      }}>
      {children}
    </TouchableOpacity>
  );
};

const CopyLink: React.FC<LinkProps> = ({username}) => {
  const handleCopyLink = () => {
    ShareUtils.copyToClipboard(username);
    SimpleToast.showWithGravity(
      `Link Copied! \n${config.SHARE_URL}/u/${username}`,
      SimpleToast.SHORT,
      SimpleToast.CENTER
    );
  };
  return (
    <View
      style={{
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 10,
        marginHorizontal: 8
      }}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{padding: 10, flex: 1, fontWeight: '600', color: colors.gray1, fontSize: 9}}>
        {`${config.SHARE_URL}/u/${username}`}
      </Text>

      <Button color={colors.darkBlue} onPress={handleCopyLink} styles={{alignSelf: 'center'}}>
        <Text style={{color: colors.white, fontWeight: '600', fontSize: 12}}>Copy Link</Text>
      </Button>
    </View>
  );
};

const InstagramButton = () => (
  <LinearGradient
    colors={['#7024C4', '#C21975', '#C74C4D', '#E09B3D']}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}
    style={{
      paddingVertical: 9,
      paddingHorizontal: 12,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
    <Text
      style={{
        color: colors.white,
        fontWeight: '600',
        textAlign: 'center',
        marginRight: 6,
        fontSize: 12
      }}>
      IG Story
    </Text>
    <InstagramIcon height={16} width={16} />
  </LinearGradient>
);

const LinkAndSocialMedia: React.FC<LinkProps> = ({username}) => {
  return (
    <View
      style={{
        backgroundColor: '#F5F5F5',
        marginTop: 19,
        borderRadius: 15,
        padding: 10
      }}>
      <Text style={{color: colors.darkBlue, fontWeight: '700', textAlign: 'center', fontSize: 12}}>
        Receive anonymous messages anywhere:
      </Text>

      <View
        style={{
          backgroundColor: colors.white,
          flex: 1,
          padding: 10,
          borderRadius: 8,
          marginVertical: 10
        }}>
        <Text
          style={{color: colors.darkBlue, fontWeight: '600', textAlign: 'center', fontSize: 12}}>
          Step 1: Copy your link
        </Text>
        <CopyLink username={username} />
      </View>

      <View
        style={{
          backgroundColor: colors.white,
          flex: 1,
          padding: 10,
          borderRadius: 8
        }}>
        <Text
          style={{
            color: colors.darkBlue,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 10,
            fontSize: 12
          }}>
          Step 2: Share your link
        </Text>

        <View style={{flexDirection: 'row'}}>
          <Button
            color="#26A7DE"
            onPress={() => {
              // TODO: action here
            }}
            styles={{alignSelf: 'center', flex: 1, flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.white,
                fontWeight: '600',
                textAlign: 'center',
                marginRight: 6,
                fontSize: 12
              }}>
              Tweet
            </Text>
            <TwitterIcon height={16} width={20} />
          </Button>

          <InstagramButton />

          <Button
            color={colors.darkBlue}
            onPress={() => {
              ShareUtils.shareUserLink(username);
            }}
            styles={{alignSelf: 'center', flex: 1}}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{color: colors.white, fontWeight: '600', textAlign: 'center', fontSize: 12}}>
              Elsewhere
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default LinkAndSocialMedia;
