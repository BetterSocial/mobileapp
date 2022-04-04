import * as React from 'react';
import IconEP from 'react-native-vector-icons/Entypo';
import {ChannelAvatar} from 'stream-chat-react-native';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import DefaultGroupProfilePicture from '../../assets/images/default-group-picture.png';
import MemoIc_arrow_back_white from '../../assets/arrow/Ic_arrow_back_white';
import {Context} from '../../context';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {getChatName, getGroupMemberCount} from '../../utils/string/StringUtils';
import {trimString} from '../../utils/string/TrimString';

const Header = ({}) => {
  const navigation = useNavigation();
  const [channelClient] = React.useContext(Context).channel;
  const [profileContext] = React.useContext(Context).profile;
  const {channel} = channelClient;

  let username = channelClient.channel?.data?.name;

  let chatName = getChatName(username, profileContext.myProfile.username);

  const renderHeaderImage = () => {
    if (channel?.data?.image) {
      if (channel?.data?.image.indexOf('res.cloudinary.com') > -1) {
        return (
          <Image source={{uri: channel?.data?.image}} style={styles.image} />
        );
      }
      return (
        <Image
          source={{uri: `data:image/jpg;base64,${channel?.data?.image}`}}
          style={styles.image}
        />
      );
    } else if (getGroupMemberCount(channel) > 2) {
      return <Image source={DefaultGroupProfilePicture} style={styles.image} />;
    } else {
      return (
        <View style={styles.containerAvatar}>
          <ChannelAvatar channel={channel} />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.row, {flex: 1}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MemoIc_arrow_back_white width={20} height={12} />
        </TouchableOpacity>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('GroupInfo')}>
          <View style={styles.touchable}>
            {renderHeaderImage()}
            <Text numberOfLines={1} style={styles.name}>{username} </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btnOptions}
          onPress={() =>
            navigation.navigate('GroupSetting', {
              username,
              focusChatName : true,
            })
          }>
          <IconEP name="dots-three-vertical" size={12.87} color={'#fff'} />
        </TouchableOpacity>
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
    paddingLeft: 9.165,
    paddingRight: 4,
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
    flex: 1
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
