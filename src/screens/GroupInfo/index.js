import * as React from 'react';
import {
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {
  GroupAvatar,
  useChannelPreviewDisplayAvatar,
  ThemeProvider,
} from 'stream-chat-react-native';

import moment from 'moment';
import Header from './elements/Header';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import {Context} from '../../context';
import {ProfileContact} from '../../components/Items';
import {trimString} from '../../utils/string/TrimString';

const GroupInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [groupChatState] = React.useContext(Context).groupChat;
  const {participants, asset} = groupChatState;
  const [channelState] = React.useContext(Context).channel;
  const {channel, profileChannel} = channelState;
  const [countUser] = React.useState(Object.entries(participants).length);

  const showImageProfile = () => {
    if (profileChannel || channel?.data?.image) {
      if (channel?.data?.image) {
        return (
          <Image
            style={styles.btnUpdatePhoto}
            source={{uri: `data:image/jpg;base64,${channel?.data?.image}`}}
          />
        );
      } else {
        return (
          <ThemeProvider>
            <GroupAvatar size={100} images={profileChannel} />
          </ThemeProvider>
        );
      }
    }
    return (
      <TouchableOpacity style={styles.btnUpdatePhoto}>
        <MemoIc_pencil width={50} height={50} color={colors.gray1} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={route.params?.username} />
      <View style={styles.lineTop} />
      <ScrollView>
        <SafeAreaView>
          <View style={styles.containerPhoto}>{showImageProfile()}</View>
          <View style={styles.containerGroupName}>
            <Text style={styles.groupName}>
              {trimString(route.params?.username, 20)}
            </Text>
            {/* <TouchableWithoutFeedback>
              <MemoIc_pencil width={20} height={20} color={colors.gray1} />
            </TouchableWithoutFeedback> */}
          </View>
          <Text style={styles.dateCreate}>
            Created {moment(route.params?.createChat).format('DD/MM/YY')}
          </Text>
          <View style={styles.lineTop} />
          <View style={styles.containerMedia(asset.length === 0)}>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('GroupMedia')}>
              <Text style={styles.btnToMediaGroup}>Media & Links ></Text>
            </TouchableWithoutFeedback>
            <FlatList
              data={asset}
              keyExtractor={(item, index) => index.toString()}
              style={styles.listImage(asset.length === 0)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => (
                <Image
                  source={{
                    uri: item.message.attachments[0].image_url,
                  }}
                  width={80}
                  height={80}
                  style={styles.image(index === 0)}
                />
              )}
            />
          </View>
          <View style={styles.lineTop} />
          <View style={styles.users}>
            <Text style={styles.countUser}>Participants ({countUser})</Text>
            <FlatList
              data={Object.keys(participants)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <ProfileContact
                  key={item}
                  fullname={participants[item].user.name}
                  photo={participants[item].user.image}
                />
              )}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
      {!channel?.cid.includes('!members') && (
        <View style={styles.btnAdd}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('AddParticipant')}>
            <Text style={styles.btnAddText}>+ Add Participants</Text>
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  );
};

export default GroupInfo;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingBottom: 30},
  users: {
    paddingTop: 12,
  },
  photoProfile: {
    height: 50,
    width: 50,
  },
  listImage: (isIsset) => ({
    marginTop: isIsset ? 0 : 12,
  }),
  btnAddText: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 20,
    color: colors.holytosca,
  },
  btnAdd: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.lightgrey,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 8,
    alignSelf: 'center',
    bottom: 5,
  },
  countUser: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 16.94,
    color: colors.holytosca,
    marginLeft: 20,
    marginBottom: 4,
  },
  image: (isFirst) => ({
    width: 80,
    height: 80,
    marginLeft: isFirst ? 0 : 5,
  }),
  btnToMediaGroup: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 16.94,
    color: colors.holytosca,
  },
  containerMedia: (isIsset) => ({
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: isIsset ? 12 : 8,
  }),
  dateCreate: {
    marginLeft: 20,
    fontSize: 14,
    fontFamily: fonts.inter[400],
    lineHeight: 16.94,
    color: '#000',
    marginTop: 4,
    marginBottom: 9,
  },
  groupName: {
    fontSize: 24,
    fontFamily: fonts.inter[500],
    lineHeight: 29.05,
    color: '#000',
  },
  lineTop: {
    backgroundColor: colors.alto,
    height: 1,
  },
  containerGroupName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 28,
  },
  containerPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 13,
  },
  btnUpdatePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.alto,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
