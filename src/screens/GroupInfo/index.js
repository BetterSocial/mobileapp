import * as React from 'react';
import moment from 'moment';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation, useRoute} from '@react-navigation/native';

import DefaultChatGroupProfilePicture from '../../assets/images/default-chat-group-picture.png';
import Header from '../../components/Header';
import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {Loading} from '../../components';
import {ProfileContact} from '../../components/Items';
import {colors} from '../../utils/colors';
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';
import {getChatName} from '../../utils/string/StringUtils';
import {requestExternalStoragePermission} from '../../utils/permission';
import {setParticipants} from '../../context/actions/groupChat';
import {trimString} from '../../utils/string/TrimString';
import {uploadFile} from '../../service/file';

const GroupInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [groupChatState, groupPatchDispatch] =
    React.useContext(Context).groupChat;
  const {participants, asset} = groupChatState;
  const [channelState, dispatch] = React.useContext(Context).channel;
  const [profile] = React.useContext(Context).profile;
  const {channel, profileChannel} = channelState;
  const [isLoadingMembers, setIsLoadingMembers] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState('');
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [mappingMedia, setMappingMedia] = React.useState([])

  let username = channelState.channel?.data?.name;
  let createChat = channelState.channel?.data?.created_at;
  let countUser = Object.entries(participants).length;

  console.log(username)

  const serializeMembersList = (result = []) => {
    if (typeof result !== 'object') {
      return {};
    }

    if (result.length === 0) {
      return {};
    }

    let membersObject = {};
    result.forEach((item, index) => {
      membersObject[item.user_id] = item;
    });
    return membersObject;
  };

  const getMembersList = async () => {
    try {
      let result = await channel.queryMembers({});
      let serializedMember = serializeMembersList(result.members);
      setParticipants(serializedMember, groupPatchDispatch);
      setIsLoadingMembers(false);  
    } catch(e) {
      console.log(e)
      setIsLoadingMembers(false)
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('route.parms.from')
      console.log(route?.params?.from)
      if (route?.params?.from === 'AddParticipant') {
        setIsLoadingMembers(true);
        getMembersList();
      }  
    })

    return unsubscribe;
  },[navigation]);

  const showImageProfile = () => {
    if (profileChannel || channel?.data?.image) {
      if (uploadedImage !== '') {
        return (
          <Image style={styles.btnUpdatePhoto} source={{uri: uploadedImage !== '' ? uploadedImage: undefined}} />
        );
      }

      if (channel?.data?.image?.indexOf('res.cloudinary.com') > -1) {
        return (
          <Image
            style={styles.btnUpdatePhoto}
            source={{uri: channel?.data?.image !== '' ? channel?.data?.image : undefined}}
          />
        );
      }

      if (channel?.data?.image) {
        return (
          <Image
            style={styles.btnUpdatePhoto}
            source={{uri: `data:image/jpg;base64,${channel?.data?.image}`}}
          />
        );
      } else {
        return (
          <View style={styles.containerAvatar}>
            <Image
              source={DefaultChatGroupProfilePicture}
              style={styles.groupProfilePicture}
            />
          </View>
        );
      }
    }
    return (
      <View style={styles.btnUpdatePhoto}>
        <MemoIc_pencil width={50} height={50} color={colors.gray1} />
      </View>
    );
  };

  let chatName = getChatName(username, profile.myProfile.username);

  const onProfilePressed = (data) => {
    if (profile.myProfile.user_id === participants[data].user_id) {
      navigation.navigate('ProfileScreen', {
        isNotFromHomeTab : true
      });
      return;
    }

    navigation.navigate('OtherProfile', {
      data: {
        user_id: profile.myProfile.user_id,
        other_id: participants[data].user_id,
        username: participants[data].user.name,
      },
    });
  };

  const handleOnNameChange = () => {
    navigation.push('GroupSetting', {
      username: chatName,
      focusChatName: true,
    });
  };

  const handleOnImageClicked = () => {
    launchGallery();
  };

  const uploadImageBase64 = async (res) => {
    try {
      setIsUploadingImage(true);
      let result = await uploadFile(`data:image/jpeg;base64,${res.base64}`);
      setUploadedImage(result.data.url);
      let dataEdit = {
        name: chatName,
        image: result.data.url,
      };

      await channel.update(dataEdit);
      setIsUploadingImage(false);
    } catch (e) {
      console.log(e);
    }
  };

  const launchGallery = async () => {
    let {success, message} = await requestExternalStoragePermission();
    if (success) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxHeight: 500,
          maxWidth: 500,
          includeBase64: true,
        },
        (res) => {
          if (!res.didCancel) {
            uploadImageBase64(res);
          }
        },
      );
    }
  };

  React.useEffect(() => {
    if(asset) {
      const myMedia = []
      asset.forEach((data) => {
        myMedia.push(...data.message.attachments)
      })
      setMappingMedia(myMedia)
    }
  }, [asset])
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      {/* <Header title={chatName} /> */}
      <Header isCenter onPress={() => navigation.goBack()} title={chatName} />
      <View style={styles.lineTop} />
      <ScrollView>
        <SafeAreaView>
          <TouchableOpacity onPress={handleOnImageClicked}>
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
            <TouchableOpacity
              onPress={handleOnNameChange}
              style={styles.pencilIconTouchable}>
              <MemoIc_pencil width={20} height={20} color={colors.gray1} />
            </TouchableOpacity>
          </View>
          <View style={styles.lineTop} />
          <View style={styles.containerMedia(asset.length === 0)}>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('GroupMedia')}>
              <Text style={styles.btnToMediaGroup}>{'Media & Links >'}</Text>
            </TouchableWithoutFeedback>
            <FlatList
              data={mappingMedia}
              keyExtractor={(item, index) => index.toString()}
              style={styles.listImage(asset.length === 0)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => (
               <>
               {index > 10 ? null :  <Image
                  source={{
                    uri: item.image_url,
                  }}
                  width={80}
                  height={80}
                  style={styles.image(index === 0)}
                />}
               </>
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
                <View style={{height: normalize(72)}}>
                  <ProfileContact
                    key={item}
                    onPress={() => onProfilePressed(item)}
                    fullname={participants[item].user.name}
                    photo={participants[item].user.image}
                  />
                </View>
              )}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
      {!channel?.cid.includes('!members') && (
        <View style={styles.btnAdd}>
          <TouchableWithoutFeedback
            onPress={() => navigation.push('AddParticipant')}>
            <Text style={styles.btnAddText}>+ Add Participants</Text>
          </TouchableWithoutFeedback>
        </View>
      )}
      <View style={styles.containerLoading}>
        <Loading visible={isLoadingMembers} />
      </View>
      <Loading visible={isUploadingImage} />
    </SafeAreaView>
  );
};

export default GroupInfo;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingBottom: 40},
  users: {
    paddingTop: 12,
  },
  photoProfile: {
    height: normalize(50),
    width: normalize(50),
  },
  listImage: (isIsset) => ({
    marginTop: isIsset ? 0 : 12,
  }),
  btnAddText: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(20),
    color: colors.holytosca,
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
    bottom: 5,
  },
  countUser: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(16.94),
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
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(16.94),
    color: colors.holytosca,
  },
  containerMedia: (isIsset) => ({
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: isIsset ? 12 : 8,
  }),
  dateCreate: {
    marginLeft: 20,
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    lineHeight: normalizeFontSize(16.94),
    color: '#000',
    marginTop: 4,
    marginBottom: 9,
  },
  groupName: {
    fontSize: normalizeFontSize(24),
    fontFamily: fonts.inter[500],
    lineHeight: normalizeFontSize(29.05),
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
  },
  containerPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 13,
  },
  btnUpdatePhoto: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    backgroundColor: colors.alto,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupProfilePicture: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    paddingLeft: 8,
  },
  containerLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  pencilIconTouchable: {
    padding: 4,
    marginRight: 28,
    alignContent: 'center',
    alignItems: 'center',
    height: 28,
  },
});
