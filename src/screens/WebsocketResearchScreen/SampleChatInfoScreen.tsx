/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

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
  View
} from 'react-native';

import FastImage from 'react-native-fast-image';
import AnonymousChatInfoHeader from '../../components/Header/AnonymousChatInfoHeader';
import AnonymousIcon from '../ChannelListScreen/elements/components/AnonymousIcon';
import useAnonymousChatInfoScreenHook from '../../hooks/screen/useAnonymousChatInfoHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {Loading} from '../../components';
import {ProfileContact} from '../../components/Items';
import {colors} from '../../utils/colors';
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';
import {trimString} from '../../utils/string/TrimString';
import {Context} from '../../context';
import {isContainUrl} from '../../utils/Utils';

export const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingBottom: 40},
  users: {
    paddingTop: 12
  },
  photoProfile: {
    height: normalize(50),
    width: normalize(50)
  },
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
  btnToMediaGroup: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(16.94),
    color: colors.holytosca
  },
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
  },
  mr7: {
    marginRight: 7
  },
  imageUser: {
    height: normalize(48),
    width: normalize(48),
    borderRadius: normalize(24)
  }
});

const SampleChatInfoScreen = () => {
  const {channelInfo, goBack, onContactPressed} = useAnonymousChatInfoScreenHook();
  const [profile] = React.useContext(Context).profile;
  const [isLoadingMembers] = React.useState<boolean>(false);
  // TODO: Change this into useUserAuthHook
  const {signedProfileId} = useProfileHook();
  const ANONYMOUS_USER = 'AnonymousUser';
  const showImageProfile = () => {
    return (
      <Image
        testID="image1"
        style={styles.btnUpdatePhoto}
        source={{uri: channelInfo?.channelPicture}}
      />
    );
  };

  const {anon_user_info_color_code, anon_user_info_emoji_code, anon_user_info_emoji_name} =
    channelInfo?.rawJson?.channel || {};
  console.log({channelInfo, profile}, 'channel');

  const renderImageComponent = (item) => {
    if (!isContainUrl(item?.user?.image) || item?.user?.name === ANONYMOUS_USER) {
      return (
        <View style={styles.mr7}>
          <AnonymousIcon
            color={anon_user_info_color_code}
            emojiCode={anon_user_info_emoji_code}
            size={normalize(48)}
          />
        </View>
      );
    }
    return (
      <View style={styles.mr7}>
        <FastImage style={styles.imageUser} source={{uri: item?.user?.image}} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      {isLoadingMembers ? null : (
        <>
          <AnonymousChatInfoHeader isCenter onPress={goBack} title={channelInfo?.name} />
          <View style={styles.lineTop} />
          <ScrollView nestedScrollEnabled={true}>
            <SafeAreaView>
              <TouchableOpacity testID="imageClick">
                <View style={styles.containerPhoto}>{showImageProfile()}</View>
              </TouchableOpacity>
              <View style={styles.row}>
                <View style={styles.column}>
                  <View style={styles.containerGroupName}>
                    <Text style={styles.groupName}>{trimString(channelInfo?.name, 20)}</Text>
                  </View>
                  <Text style={styles.dateCreate}>
                    Created {moment(channelInfo?.createdAt).format('MM/DD/YYYY')}
                  </Text>
                </View>
              </View>
              <View style={styles.lineTop} />
              <View style={styles.lineTop} />
              <View style={styles.users}>
                <Text style={styles.countUser}>Participants ({channelInfo?.members?.length})</Text>
                <FlatList
                  testID="participants"
                  data={channelInfo?.rawJson?.channel?.members}
                  keyExtractor={(item, index) => index?.toString()}
                  renderItem={({item, index}) => (
                    <View style={{height: normalize(72)}}>
                      <ProfileContact
                        key={index}
                        item={item}
                        onPress={() => onContactPressed(item)}
                        fullname={item?.user?.name}
                        photo={item?.user?.profilePicture}
                        showArrow={item?.user_id !== profile?.myProfile?.user_id}
                        userId={signedProfileId}
                        ImageComponent={renderImageComponent(item)}
                      />
                    </View>
                  )}
                />
              </View>
              <View style={styles.gap} />
            </SafeAreaView>
          </ScrollView>
          <View style={styles.containerLoading}>
            <Loading visible={isLoadingMembers} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default SampleChatInfoScreen;
