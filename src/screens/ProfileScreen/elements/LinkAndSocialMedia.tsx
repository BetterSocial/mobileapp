import React, {FC} from 'react';
import {Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';
import InstagramIcon from '../../../assets/social-media/instagram.svg';
import TwitterIcon from '../../../assets/social-media/twitter.svg';

const Button: FC<{onPress: () => void; color: string; styles?: ViewStyle}> = ({
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

const CopyLink = () => (
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
      https//:me.bettersocial.org/u/bayubayubayu
    </Text>

    <Button
      color={colors.darkBlue}
      onPress={() => {
        // TODO: action here
      }}
      styles={{alignSelf: 'center'}}>
      <Text style={{color: colors.white, fontWeight: '600', fontSize: 12}}>Copy Link</Text>
    </Button>
  </View>
);

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

const LinkAndSocialMedia = () => {
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
        <Text style={{color: colors.darkBlue, fontWeight: '600', textAlign: 'center'}}>
          Step 1: Copy your link
        </Text>
        <CopyLink />
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
              // TODO: action here
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
