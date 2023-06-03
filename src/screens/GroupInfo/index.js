import * as React from 'react';
import moment from 'moment';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';
import ExitGroup from '../../assets/images/exit-group.png';
import ReportGroup from '../../assets/images/report.png';

import DefaultChatGroupProfilePicture from '../../assets/images/default-chat-group-picture.png';
import Header from '../../components/Header';
// eslint-disable-next-line camelcase
import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import useGroupInfo from './hooks/useGroupInfo';
import {Loading} from '../../components';
import {ProfileContact} from '../../components/Items';
import {colors} from '../../utils/colors';
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';
import {trimString} from '../../utils/string/TrimString';
import ModalAction from './elements/ModalAction';

const GroupInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    asset,
    channel,
    profileChannel,
    isLoadingMembers,
    setIsLoadingMembers,
    uploadedImage,
    isUploadingImage,
    createChat,
    getMembersList,
    chatName,
    handleOnNameChange,
    handleOnImageClicked,
    newParticipant,
    selectedUser,
    handleCloseSelectUser,
    openModal,
    alertRemoveUser,
    memberName,
    onLeaveGroup,
    profile,
    channelState,
    handlePressContact,
    participants
  } = useGroupInfo();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route?.params?.from === 'AddParticipant') {
        setIsLoadingMembers(true);
        getMembersList();
      }
    });

    return unsubscribe;
  }, [navigation]);

  const showImageProfile = () => {
    if (profileChannel || channel?.data?.image) {
      if (uploadedImage !== '') {
        return (
          <Image
            testID="image1"
            style={styles.btnUpdatePhoto}
            source={{uri: uploadedImage !== '' ? uploadedImage : undefined}}
          />
        );
      }

      if (channel?.data?.image?.indexOf('res.cloudinary.com') > -1) {
        return (
          <Image
            testID="image2"
            style={styles.btnUpdatePhoto}
            source={{uri: channel?.data?.image !== '' ? channel?.data?.image : undefined}}
          />
        );
      }

      if (channel?.data?.image) {
        return (
          <Image
            testID="image3"
            style={styles.btnUpdatePhoto}
            source={{uri: `data:image/jpg;base64,${channel?.data?.image}`}}
          />
        );
      }
      return (
        <View style={styles.containerAvatar}>
          <Image
            testID="image4"
            source={DefaultChatGroupProfilePicture}
            style={styles.groupProfilePicture}
          />
        </View>
      );
    }
    return (
      <View testID="image5" style={styles.btnUpdatePhoto}>
        <MemoIc_pencil width={50} height={50} color={colors.gray1} />
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    if (item.message.attachments && Array.isArray(item.message.attachments)) {
      return (
        <Image
          source={{
            uri: item.message.attachments[0] && item.message.attachments[0].image_url
          }}
          width={80}
          height={80}
          style={styles.image(index === 0)}
          testID="renderItem"
        />
      );
    }
    return null;
  };
  const handleMember = async () => {
    await getMembersList();
  };
  React.useEffect(() => {
    handleMember();
  }, []);

  React.useEffect(() => {
    getMembersList();
  }, []);
  console.log(openModal, 'laka');
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      {/* <Header title={chatName} /> */}
      {isLoadingMembers ? null : (
        <>
          <Header isCenter onPress={() => navigation.goBack()} title={memberName()} />
          <View style={styles.lineTop} />
          <ScrollView nestedScrollEnabled={true}>
            <SafeAreaView>
              <TouchableOpacity testID="imageClick" onPress={handleOnImageClicked}>
                <View style={styles.containerPhoto}>{showImageProfile()}</View>
              </TouchableOpacity>
              <View style={styles.row}>
                <View style={styles.column}>
                  <View style={styles.containerGroupName}>
                    <Text style={styles.groupName}>{trimString(chatName, 20)}</Text>
                  </View>
                  <Text style={styles.dateCreate}>
                    Created {moment(createChat).format('DD/MM/YY')}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleOnNameChange} style={styles.pencilIconTouchable}>
                  <MemoIc_pencil width={20} height={20} color={colors.gray1} />
                </TouchableOpacity>
              </View>
              <View style={styles.lineTop} />
              <View style={styles.containerMedia(asset && asset.length === 0)}>
                <TouchableWithoutFeedback
                  testID="groupMedia"
                  onPress={() => navigation.navigate('GroupMedia')}>
                  <Text style={styles.btnToMediaGroup}>{'Media & Links >'}</Text>
                </TouchableWithoutFeedback>
                <FlatList
                  testID="asset"
                  data={asset}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.listImage(asset && asset.length === 0)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderItem}
                />
              </View>
              <View style={styles.lineTop} />
              <View style={styles.users}>
                <Text style={styles.countUser}>Participants ({newParticipant.length})</Text>
                <FlatList
                  testID="participants"
                  // nestedScrollEnabled={true}
                  data={newParticipant}
                  // contentContainerStyle={{paddingBottom: 10}}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <View style={{height: normalize(72)}}>
                      <ProfileContact
                        key={index}
                        item={item}
                        onPress={() => handlePressContact(item)}
                        fullname={item.user.name}
                        photo={item.user.image}
                        showArrow={channelState?.channel.data.type === 'group'}
                        userId={profile.myProfile.user_id}
                      />
                    </View>
                  )}
                />
              </View>
              <View style={styles.gap} />
              {channelState?.channel.data.type === 'group' ? (
                <View style={styles.actionGroup}>
                  <TouchableOpacity onPress={onLeaveGroup} style={styles.buttonGroup}>
                    <View style={styles.imageActContainer}>
                      <FastImage style={styles.imageAction} source={ExitGroup} />
                    </View>
                    <View>
                      <Text style={styles.textAct}>Exit Group</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonGroup}>
                    <View style={styles.imageActContainer}>
                      <FastImage style={styles.imageAction} source={ReportGroup} />
                    </View>
                    <View>
                      <Text style={styles.textAct}>Report Group</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </SafeAreaView>
          </ScrollView>
          {channelState?.channel.data.type === 'group' && (
            <View style={styles.btnAdd}>
              <TouchableOpacity
                testID="addParticipant"
                onPress={() => navigation.push('AddParticipant', {refresh: getMembersList})}>
                <Text style={styles.btnAddText}>+ Add Participants</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.containerLoading}>
            <Loading visible={isLoadingMembers} />
          </View>
          <Loading visible={isUploadingImage} />
          <ModalAction
            name={selectedUser?.user?.name}
            isOpen={openModal}
            onCloseModal={handleCloseSelectUser}
            selectedUser={selectedUser}
            onPress={alertRemoveUser}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default GroupInfo;

export const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingBottom: 40},
  users: {
    paddingTop: 12
  },
  photoProfile: {
    height: normalize(50),
    width: normalize(50)
  },
  listImage: (isIsset) => ({
    marginTop: isIsset ? 0 : 12
  }),
  btnAddText: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(20),
    color: colors.holytosca
  },
  btnAdd: {
    padding: normalize(8),
    backgroundColor: colors.lightgrey,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 8,
    alignSelf: 'center',
    bottom: 5
  },
  countUser: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(16.94),
    color: colors.holytosca,
    marginLeft: 20,
    marginBottom: 4
  },
  image: (isFirst) => ({
    width: 80,
    height: 80,
    marginLeft: isFirst ? 0 : 5
  }),
  btnToMediaGroup: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(16.94),
    color: colors.holytosca
  },
  containerMedia: (isIsset) => ({
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: isIsset ? 12 : 8
  }),
  dateCreate: {
    marginLeft: 20,
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    lineHeight: normalizeFontSize(16.94),
    color: '#000',
    marginTop: 4,
    marginBottom: 9
  },
  groupName: {
    fontSize: normalizeFontSize(24),
    fontFamily: fonts.inter[500],
    lineHeight: normalizeFontSize(29.05),
    color: '#000'
  },
  lineTop: {
    backgroundColor: colors.alto,
    height: 1
  },
  containerGroupName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20
  },
  containerPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 13
  },
  btnUpdatePhoto: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    backgroundColor: colors.alto,
    justifyContent: 'center',
    alignItems: 'center'
  },
  groupProfilePicture: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    paddingLeft: 8
  },
  containerLoading: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  pencilIconTouchable: {
    padding: 4,
    marginRight: 28,
    alignContent: 'center',
    alignItems: 'center',
    height: 28
  },
  gap: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 50
  },
  actionGroup: {
    marginTop: 22
  },
  buttonGroup: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 13
  },
  imageAction: {
    height: 20,
    width: 20
  },
  imageActContainer: {
    marginRight: 26
  },
  textAct: {
    color: '#FF2E63',
    fontSize: 14
  }
});
