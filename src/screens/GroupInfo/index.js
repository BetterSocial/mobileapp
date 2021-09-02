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

import moment from 'moment';
import Header from './elements/Header';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import ItemUser from './elements/ItemUser';
import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import {Context} from '../../context';

const GroupInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [groupChatState] = React.useContext(Context).groupChat;
  const {participants, asset} = groupChatState;
  const [countUser] = React.useState(Object.entries(participants).length);
  return (
    <View style={styles.container}>
      <Header title={route.params?.username} />
      <View style={styles.lineTop} />
      <ScrollView>
        <SafeAreaView>
          <View style={styles.containerPhoto}>
            {route.params?.profile ? (
              <Image
                source={{uri: route.params?.profile}}
                style={styles.btnUpdatePhoto}
              />
            ) : (
              <TouchableOpacity style={styles.btnUpdatePhoto}>
                <MemoIc_pencil width={50} height={50} color={colors.gray1} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.containerGroupName}>
            <Text style={styles.groupName}>{route.params?.username}</Text>
            {/* <TouchableWithoutFeedback>
              <MemoIc_pencil width={20} height={20} color={colors.gray1} />
            </TouchableWithoutFeedback> */}
          </View>
          <Text style={styles.dateCreate}>
            Created {moment(route.params?.createChat).format('DD/MM/YY')}
          </Text>
          <View style={styles.lineTop} />
          <View style={styles.containerMedia}>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('GroupMedia')}>
              <Text style={styles.btnToMediaGroup}>Media & Links ></Text>
            </TouchableWithoutFeedback>
            <FlatList
              data={asset}
              keyExtractor={(item, index) => index.toString()}
              style={styles.listImage}
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
          {countUser !== 2 && (
            <View style={styles.users}>
              <Text style={styles.countUser}>Participants {countUser}</Text>
              {Object.keys(participants).map((key) => {
                return (
                  <ItemUser
                    fullname={participants[key].user.name}
                    photo={participants[key].user.image}
                    key={String(key)}
                  />
                );
              })}
            </View>
          )}
        </SafeAreaView>
      </ScrollView>
      {countUser !== 2 && (
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
  listImage: {
    marginTop: 12,
  },
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
  containerMedia: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
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
