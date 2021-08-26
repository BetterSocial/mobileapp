import React from 'react';
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

import Header from './elements/Header';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import ItemUser from './elements/ItemUser';
import MemoIc_pencil from '../../assets/icons/Ic_pencil';

const dummyUser = [
  {
    fullname: 'usup',
    photo:
      'https://i.picsum.photos/id/218/200/200.jpg?hmac=pIx-HTJBJRheNaHmhgqsQRX8JbTGvag_zic9NTNWFJU',
  },
  {
    fullname: 'fajar',
    photo:
      'https://i.picsum.photos/id/218/200/200.jpg?hmac=pIx-HTJBJRheNaHmhgqsQRX8JbTGvag_zic9NTNWFJU',
  },
  {
    fullname: 'usupUsup Suparma',
    photo:
      'https://i.picsum.photos/id/218/200/200.jpg?hmac=pIx-HTJBJRheNaHmhgqsQRX8JbTGvag_zic9NTNWFJU',
  },
];

const GroupInfo = () => {
  return (
    <View style={styles.container}>
      <Header title={'group name'} />
      <View style={styles.lineTop} />
      <ScrollView>
        <SafeAreaView>
          <View style={styles.containerPhoto}>
            <TouchableOpacity style={styles.btnUpdatePhoto}>
              <MemoIc_pencil width={50} height={50} color={colors.gray1} />
            </TouchableOpacity>
          </View>
          <View style={styles.containerGroupName}>
            <Text style={styles.groupName}>Group Name</Text>
            <TouchableWithoutFeedback>
              <MemoIc_pencil width={20} height={20} color={colors.gray1} />
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.dateCreate}>Created 7/7/21</Text>
          <View style={styles.lineTop} />
          <View style={styles.containerMedia}>
            <TouchableWithoutFeedback>
              <Text style={styles.btnToMediaGroup}>Media & Links ></Text>
            </TouchableWithoutFeedback>
            <FlatList
              data={[1, 2, 3, 4]}
              style={styles.listImage}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => (
                <Image
                  key={String(index)}
                  source={{
                    uri:
                      'https://i.picsum.photos/id/218/200/200.jpg?hmac=pIx-HTJBJRheNaHmhgqsQRX8JbTGvag_zic9NTNWFJU',
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
            <Text style={styles.countUser}>Participant (3)</Text>
            <FlatList
              data={dummyUser}
              renderItem={({item, index}) => (
                <ItemUser
                  fullname={item.fullname}
                  photo={item.photo}
                  key={String(index)}
                />
              )}
            />
          </View>
          <View style={styles.btnAdd}>
            <TouchableWithoutFeedback>
              <Text style={styles.btnAddText}>+ Add Participants</Text>
            </TouchableWithoutFeedback>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default GroupInfo;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  users: {
    paddingTop: 12,
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
    bottom: 0,
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
