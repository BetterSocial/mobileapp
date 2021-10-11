import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

import IconEP from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {ChannelAvatar} from 'stream-chat-react-native';

import MemoIc_arrow_back_white from '../../assets/arrow/Ic_arrow_back_white';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {Context} from '../../context';
import {trimString} from '../../utils/string/TrimString';
import {getChatName} from '../../utils/string/StringUtils';

const Header = ({username, profile, createChat}) => {
  const navigation = useNavigation();
  const [channelClient] = React.useContext(Context).channel;
  const {channel} = channelClient;

  console.log('username');
  console.log(username);

  let chatName = getChatName(username);

  return (
    <View style={styles.container}>
      <View style={[styles.row, {flex: 1}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MemoIc_arrow_back_white width={20} height={12} />
        </TouchableOpacity>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('GroupInfo', {
              username,
              createChat,
              profile,
            })
          }>
          <View style={styles.touchable}>
            {channel?.data?.image ? (
              <Image
                source={{uri: `data:image/jpg;base64,${channel?.data?.image}`}}
                style={styles.image}
              />
            ) : (
              <View style={styles.containerAvatar}>
                <ChannelAvatar channel={channel} />
              </View>
            )}
            <Text style={styles.name}>{trimString(chatName, 21)}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btnOptions}
          onPress={() =>
            navigation.navigate('GroupSetting', {
              username,
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
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
