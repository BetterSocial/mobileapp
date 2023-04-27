import * as React from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ButtonAddParticipants from '../../components/Button/ButtonAddParticipants';
import EditGroup from './elements/EditGroup';
import HeaderContact from '../../components/Header/HeaderContact';
import Loading from '../Loading';
import useGroupSetting from './hooks/useGroupSetting';
import {COLORS} from '../../utils/theme';
import {ProfileContact} from '../../components/Items';
import {fonts} from '../../utils/fonts';

const {width} = Dimensions.get('screen');

const GroupSetting = ({navigation, route}) => {
  const {
    participants,
    groupName,
    countUser,
    urlImage,
    isLoading,
    updateName,
    submitData,
    lounchGalery,
    renderHeaderSubtitleText
  } = useGroupSetting({navigation, route});

  const isFocusChatName = route?.params?.focusChatName;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <ScrollView>
        <HeaderContact
          title={'Settings'}
          containerStyle={styles.containerHeader}
          subTitle={renderHeaderSubtitleText()}
          subtitleStyle={styles.subtitleStyle}
          onPressSub={submitData}
          onPress={() => navigation.goBack()}
        />
        <EditGroup
          imageUri={urlImage}
          editName={groupName}
          setEditName={updateName}
          onUpdateImage={lounchGalery}
          isFocusChatName={isFocusChatName}
          saveGroupName={() => submitData(false, false)}
        />
        <Loading visible={isLoading} />
        <View style={styles.users}>
          <Text style={styles.countUser}>{`Participants (${countUser})`}</Text>
          <FlatList
            data={Object.keys(participants)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={{height: 72}}>
                <ProfileContact
                  key={item}
                  fullname={participants[item].user.name}
                  photo={participants[item].user.image}
                />
              </View>
            )}
          />
        </View>
        <ButtonAddParticipants />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroupSetting;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  subtitleStyle: {
    color: COLORS.holyTosca
  },
  containerHeader: {marginLeft: 22, marginRight: 20},
  users: {
    paddingTop: 12,
    width
  },
  countUser: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 16.94,
    color: COLORS.holytosca,
    marginLeft: 20,
    marginBottom: 4
  }
});
