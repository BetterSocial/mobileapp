import * as React from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';
import ButtonAddParticipants from '../../components/Button/ButtonAddParticipants';
import HeaderContact from '../../components/Header/HeaderContact';
import {ProfileContact} from '../../components/Items';
import {Context} from '../../context';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import EditGroup from './elements/EditGroup';

const width = Dimensions.get('screen').width;

const GroupSetting = ({navigation, route}) => {
  const [groupChatState] = React.useContext(Context).groupChat;
  const [channelState] = React.useContext(Context).channel;
  const {participants} = groupChatState;
  const {channel} = channelState;
  const [groupName, setGroupName] = React.useState(
    route.params.username || 'Set Group Name',
  );
  const [countUser] = React.useState(Object.entries(participants).length);
  const [anyUpdate, setAnyUpdate] = React.useState(false);
  const [base64Profile, setBase64Profile] = React.useState('');
  const [urlImage, setUrlImage] = React.useState('');

  const updateName = (text) => {
    setGroupName(text);
    setAnyUpdate(true);
  };
  const submitData = async () => {
    if (anyUpdate) {
      await channel.update({
        name: groupName,
        image: base64Profile,
      });
      await navigation.navigate('ChannelList');
    } else {
      navigation.goBack();
    }
  };
  const lounchGalery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxHeight: 55,
        maxWidth: 55,
        includeBase64: true,
      },
      (res) => {
        setAnyUpdate(true);
        setBase64Profile(res.base64);
        setUrlImage(res.uri);
        console.log('res image ', res.uri);
      },
    );
  };

  return (
    <View style={styles.container}>
      <HeaderContact
        title={'Settings'}
        containerStyle={styles.containerHeader}
        subTitle={anyUpdate ? 'Finish' : 'Skip'}
        subtitleStyle={styles.subtitleStyle}
        onPressSub={submitData}
        onPress={() => navigation.goBack()}
      />
      <EditGroup
        imageUri={urlImage}
        editName={groupName}
        setEditName={updateName}
        onUpdateImage={lounchGalery}
      />
      <View style={styles.users}>
        <Text style={styles.countUser}>Participants {countUser}</Text>
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
      <ButtonAddParticipants />
    </View>
  );
};

export default GroupSetting;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  subtitleStyle: {
    color: COLORS.holyTosca,
  },
  containerHeader: {marginLeft: 22, marginRight: 20},
  users: {
    paddingTop: 12,
    width: width,
  },
  countUser: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 16.94,
    color: COLORS.holytosca,
    marginLeft: 20,
    marginBottom: 4,
  },
});
