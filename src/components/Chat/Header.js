import * as React from 'react';
import IconEP from 'react-native-vector-icons/Entypo';
import { ChannelAvatar } from 'stream-chat-react-native';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import DefaultGroupProfilePicture from '../../assets/images/default-group-picture.png';
import GlobalButton from '../Button/GlobalButton';
import MemoIc_arrow_back_white from '../../assets/arrow/Ic_arrow_back_white';
import { Context } from '../../context';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { getChatName, getGroupMemberCount } from '../../utils/string/StringUtils';

const Header = () => {
  const navigation = useNavigation();
  const [channelClient] = React.useContext(Context).channel;
  const [profileContext] = React.useContext(Context).profile;
  const { channel } = channelClient;

  const username = channelClient.channel?.data?.name;

  const chatName = getChatName(username, profileContext.myProfile.username);

  console.log(channel, 'bahan')
  const renderHeaderImage = () => {
    if (channel?.data?.image) {
      if (channel?.data?.image.indexOf('res.cloudinary.com') > -1) {
        return (
          <Image source={{ uri: channel?.data?.image }} style={styles.image} />
        );
      }
      return (
        <Image
          source={{ uri: `data:image/jpg;base64,${channel?.data?.image}` }}
          style={styles.image}
        />
      );
    } if (getGroupMemberCount(channel) > 2) {
      return <Image source={DefaultGroupProfilePicture} style={styles.image} />;
    } 
      return (
        <View style={styles.containerAvatar}>
          <ChannelAvatar size={42} channel={channel} />
        </View>
      );
    
  };

  return (
    <View style={styles.container}>
      <View style={[styles.row, { flex: 1 }]}>
        <GlobalButton buttonStyle={styles.backContainer} onPress={() => navigation.goBack()}>
          <MemoIc_arrow_back_white width={20} height={12} />
        </GlobalButton>
        <GlobalButton
          buttonStyle={styles.backContainer}
          onPress={() => navigation.navigate('GroupInfo')}>
          <View style={styles.touchable}>
            {renderHeaderImage()}
            <Text numberOfLines={1} style={styles.name}>{chatName} </Text>
          </View>
        </GlobalButton>
      </View>
      <View style={styles.row}>
        <GlobalButton
          style={styles.btnOptions}
          onPress={() =>
            navigation.navigate('GroupSetting', {
              username,
              focusChatName: true,
            })
          }>
          <IconEP name="dots-three-vertical" size={12.87} color={'#fff'} />
        </GlobalButton>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: colors.holytosca,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  containerAvatar: {
    marginLeft: 18,
  },
  btnOptions: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  btnSearch: {
    paddingRight: 9.165,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    marginLeft: 18,
  },
  name: {
    marginLeft: 10,
    fontFamily: fonts.inter[600],
    color: '#fff',
    fontSize: 14,
    width: '70%',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backContainer: {
    paddingLeft: 0
  }
});
