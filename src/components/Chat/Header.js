import * as React from 'react';
import IconEP from 'react-native-vector-icons/Entypo';
import {ChannelAvatar} from 'stream-chat-react-native';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import AnonymousIcon from '../../screens/ChannelListScreen/elements/components/AnonymousIcon';
import DefaultGroupProfilePicture from '../../assets/images/default-group-picture.png';
import GlobalButton from '../Button/GlobalButton';
import MemoIc_arrow_back_white from '../../assets/arrow/Ic_arrow_back_white';
import {CHANNEL_TYPE_ANONYMOUS} from '../../utils/constants';
import {Context} from '../../context';
import {fonts} from '../../utils/fonts';
import {getChatName, getGroupMemberCount} from '../../utils/string/StringUtils';
import {COLORS} from '../../utils/theme';

const Header = ({onBack}) => {
  const navigation = useNavigation();
  const [channelClient] = React.useContext(Context).channel;
  const [profileContext] = React.useContext(Context).profile;
  const {channel} = channelClient;
  const [chatName, setChatName] = React.useState(null);
  let username = channelClient.channel?.data?.name;
  const channelType = channelClient?.channel?.data?.channel_type;
  if (channelType === CHANNEL_TYPE_ANONYMOUS) {
    username = `Anonymous ${channelClient?.channel?.data?.anon_user_info_emoji_name}`;
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (channelClient.channel?.data?.name) {
        setChatName(
          getChatName(channelClient?.channel?.data?.name, profileContext?.myProfile?.username)
        );
      }
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (
      profileContext.myProfile &&
      typeof profileContext.myProfile === 'object' &&
      typeof username === 'string'
    ) {
      setChatName(getChatName(username, profileContext.myProfile.username));
    }
  }, [JSON.stringify(profileContext.myProfile), username]);

  const renderHeaderImage = () => {
    if (channelType === CHANNEL_TYPE_ANONYMOUS) {
      return (
        <View style={{marginLeft: 18}}>
          <AnonymousIcon
            size={42}
            color={channel?.data?.anon_user_info_color_code}
            emojiCode={channel?.data?.anon_user_info_emoji_code}
          />
        </View>
      );
    }

    if (channel?.data?.image) {
      if (channel?.data?.image.indexOf('res.cloudinary.com') > -1) {
        return <Image source={{uri: channel?.data?.image}} style={styles.image} />;
      }
      return (
        <Image
          source={{uri: `data:image/jpg;base64,${channel?.data?.image}`}}
          style={styles.image}
        />
      );
    }
    if (getGroupMemberCount(channel) > 2) {
      return <Image source={DefaultGroupProfilePicture} style={styles.image} />;
    }
    return (
      <View style={styles.containerAvatar}>
        <ChannelAvatar size={42} channel={channel} />
      </View>
    );
  };

  const handleBackBtn = () => {
    if (onBack && typeof onBack === 'function') {
      return onBack();
    }
    return navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.row, {flex: 1}]}>
        <GlobalButton buttonStyle={styles.backContainer} onPress={handleBackBtn}>
          <MemoIc_arrow_back_white width={20} height={12} />
        </GlobalButton>
        <GlobalButton
          buttonStyle={styles.backContainer}
          onPress={() => navigation.push('GroupInfo')}>
          <View style={styles.touchable}>
            {renderHeaderImage()}
            <Text numberOfLines={1} style={styles.name}>
              {chatName}{' '}
            </Text>
          </View>
        </GlobalButton>
      </View>
      <View style={styles.row}>
        <GlobalButton
          style={styles.btnOptions}
          onPress={() =>
            navigation.push('GroupSetting', {
              username,
              focusChatName: true
            })
          }>
          <IconEP name="dots-three-vertical" size={12.87} color={COLORS.almostBlack} />
        </GlobalButton>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: COLORS.anon_primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    justifyContent: 'space-between'
  },
  containerAvatar: {
    marginLeft: 18
  },
  btnOptions: {
    paddingLeft: 0,
    paddingRight: 0
  },
  btnSearch: {
    paddingRight: 9.165
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    marginLeft: 18
  },
  name: {
    marginLeft: 11,
    fontFamily: fonts.inter[600],
    color: COLORS.almostBlack,
    fontSize: 14,
    width: '70%'
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  backContainer: {
    paddingLeft: 0
  }
});
