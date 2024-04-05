/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/core';

import ExitGroup from '../../assets/images/exit-group.png';
import ReportGroup from '../../assets/images/report.png';
import AnonymousChatInfoHeader from '../../components/Header/AnonymousChatInfoHeader';
import AnonymousIcon from '../ChannelListScreen/elements/components/AnonymousIcon';
import BlockComponent from '../../components/BlockComponent';
import ChannelImage from '../../components/ChatList/elements/ChannelImage';
import ModalAction from '../GroupInfo/elements/ModalAction';
import ModalActionAnonymous from '../GroupInfo/elements/ModalActionAnonymous';
import UserSchema from '../../database/schema/UserSchema';
import dimen from '../../utils/dimen';
import useChatInfoScreenHook from '../../hooks/screen/useChatInfoHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import {CHANNEL_GROUP, GROUP_INFO, SIGNED} from '../../hooks/core/constant';
import {COLORS} from '../../utils/theme';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {ProfileContact} from '../../components/Items';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {getOfficialAnonUsername} from '../../utils/string/StringUtils';
import useGroupInfo from '../GroupInfo/hooks/useGroupInfo';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack,
    paddingBottom: dimen.normalizeDimen(40)
  },
  users: {
    paddingTop: dimen.normalizeDimen(12)
  },
  photoProfile: {
    height: dimen.normalizeDimen(50),
    width: dimen.normalizeDimen(50)
  },
  btnAddText: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(20),
    color: COLORS.signed_primary
  },
  btnAdd: {
    padding: dimen.normalizeDimen(8),
    backgroundColor: COLORS.gray110,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: dimen.normalizeDimen(20)
  },
  countUser: (from) => ({
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(16.94),
    color: from === SIGNED ? COLORS.signed_primary : COLORS.anon_primary,
    marginLeft: dimen.normalizeDimen(20),
    marginBottom: dimen.normalizeDimen(4),
    fontWeight: 'bold',
    paddingTop: dimen.normalizeDimen(12)
  }),
  btnToMediaGroup: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(16.94),
    color: COLORS.anon_primary
  },
  dateCreate: {
    marginLeft: dimen.normalizeDimen(20),
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    lineHeight: normalizeFontSize(16.94),
    color: COLORS.gray510,
    marginTop: dimen.normalizeDimen(4),
    marginBottom: dimen.normalizeDimen(9)
  },
  groupName: {
    fontSize: normalizeFontSize(24),
    lineHeight: normalizeFontSize(29.05),
    color: COLORS.black,
    width: '100%',
    paddingHorizontal: dimen.normalizeDimen(20),
    fontWeight: 'bold'
  },
  lineTop: {
    backgroundColor: COLORS.gray110,
    height: 1
  },
  containerGroupName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  containerPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: dimen.normalizeDimen(8),
    paddingBottom: dimen.normalizeDimen(13)
  },
  btnUpdatePhoto: {
    width: dimen.normalizeDimen(100),
    height: dimen.normalizeDimen(100),
    borderRadius: dimen.normalizeDimen(50),
    backgroundColor: COLORS.gray110,
    justifyContent: 'center',
    alignItems: 'center'
  },
  groupProfilePicture: {
    width: dimen.normalizeDimen(100),
    height: dimen.normalizeDimen(100),
    borderRadius: dimen.normalizeDimen(50),
    paddingLeft: dimen.normalizeDimen(8)
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dimen.normalizeDimen(20)
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
    padding: dimen.normalizeDimen(4),
    marginRight: dimen.normalizeDimen(28),
    alignContent: 'center',
    alignItems: 'center',
    height: dimen.normalizeDimen(28)
  },
  gap: {
    height: 2,
    backgroundColor: COLORS.gray210
  },
  actionGroup: {
    marginTop: dimen.normalizeDimen(6)
  },
  buttonGroup: {
    flexDirection: 'row',
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingVertical: dimen.normalizeDimen(13)
  },
  imageAction: {
    height: dimen.normalizeDimen(20),
    width: dimen.normalizeDimen(20)
  },
  imageActContainer: {
    marginRight: dimen.normalizeDimen(26)
  },
  textAct: {
    color: COLORS.redalert,
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(20),
    fontFamily: fonts.inter[500]
  },
  mr7: {
    marginRight: dimen.normalizeDimen(12)
  },
  imageUser: {
    height: dimen.normalizeDimen(48),
    width: dimen.normalizeDimen(48),
    borderRadius: dimen.normalizeDimen(24)
  },
  parentContact: {
    height: dimen.normalizeDimen(72)
  }
});

const ChatInfoScreen = () => {
  const {
    isLoadingFetchingChannelDetail,
    channelInfo,
    goBack,
    onContactPressed,
    selectedUser,
    handlePressPopup,
    handleCloseSelectUser,
    openModal,
    isAnonymousModalOpen,
    blockModalRef,
    handleShowArrow,
    loadingChannelInfo,
    isLoadingInitChat
  } = useChatInfoScreenHook();
  const navigation = useNavigation();

  const {onLeaveGroup, onReportGroup} = useGroupInfo(channelInfo?.id);
  const {signedProfileId} = useUserAuthHook();
  const {params}: any = useRoute();
  const ANONYMOUS_USER = 'AnonymousUser';
  const {anonProfileId} = useProfileHook();

  const showImageProfile = (): React.ReactNode => {
    if (channelInfo?.channelType === CHANNEL_GROUP) {
      return (
        <ChannelImage>
          <ChannelImage.Big type={GROUP_INFO} image={channelInfo?.channelPicture} />
        </ChannelImage>
      );
    }

    if (channelInfo?.anon_user_info_emoji_name) {
      return (
        <AnonymousIcon
          color={channelInfo?.anon_user_info_color_code}
          emojiCode={channelInfo?.anon_user_info_emoji_code}
          size={dimen.normalizeDimen(100)}
        />
      );
    }

    return (
      <Image
        testID="image1"
        style={styles.btnUpdatePhoto}
        source={{uri: channelInfo?.channelPicture || DEFAULT_PROFILE_PIC_PATH}}
      />
    );
  };

  const renderImageComponent = (item) => {
    if (item?.anon_user_info_color_code) {
      return (
        <View style={styles.mr7}>
          <AnonymousIcon
            color={item?.anon_user_info_color_code}
            emojiCode={item?.anon_user_info_emoji_code}
            size={dimen.normalizeDimen(48)}
          />
        </View>
      );
    }

    return (
      <View style={styles.mr7}>
        <FastImage style={styles.imageUser} source={{uri: item?.profilePicture}} />
      </View>
    );
  };

  const getUsername = (item: UserSchema) => {
    if (item?.anon_user_info_color_code) {
      return getOfficialAnonUsername(item);
    }

    return item?.user?.username || item?.username || item?.name;
  };

  const countParticipant = () => {
    return `(${channelInfo?.memberUsers?.length})`;
  };

  const getHeaderComponent = React.useMemo(() => {
    return (
      <>
        <AnonymousChatInfoHeader isCenter onPress={goBack} title={channelInfo?.name} />
        <View style={styles.lineTop} />
        <TouchableOpacity testID="imageClick">
          <View style={styles.containerPhoto}>{showImageProfile()}</View>
        </TouchableOpacity>
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.containerGroupName}>
              <Text numberOfLines={1} style={styles.groupName}>
                {channelInfo?.name}
              </Text>
            </View>
            <Text style={styles.dateCreate}>
              Created {moment(channelInfo?.createdAt).format('MM/DD/YYYY')}
            </Text>
          </View>
        </View>
        <View style={styles.lineTop} />
        <Text style={styles.countUser(params?.from)}>Participants {countParticipant()}</Text>
      </>
    );
  }, [channelInfo]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} barStyle={'light-content'} />
      {loadingChannelInfo ? null : (
        <FlatList
          testID="participants"
          data={channelInfo?.memberUsers}
          keyExtractor={(_, index) => index?.toString()}
          ListHeaderComponent={getHeaderComponent}
          ListFooterComponent={
            <>
              {isLoadingFetchingChannelDetail ? <ActivityIndicator style={styles.loading} /> : null}
              {channelInfo?.channelType === CHANNEL_GROUP && (
                <View style={styles.btnAdd}>
                  <TouchableOpacity
                    testID="addParticipant"
                    onPress={() =>
                      navigation.push('ContactScreen', {
                        from: SIGNED,
                        isAddParticipant: true,
                        channelId: channelInfo?.id,
                        existParticipants: channelInfo?.memberUsers?.map((item) => item?.username)
                      })
                    }>
                    <Text style={styles.btnAddText}>+ Add Participants</Text>
                  </TouchableOpacity>
                </View>
              )}
              {channelInfo?.channelType === CHANNEL_GROUP && <View style={styles.gap} />}
              {channelInfo?.channelType === CHANNEL_GROUP && (
                <View style={styles.actionGroup}>
                  <TouchableOpacity onPress={onLeaveGroup} style={styles.buttonGroup}>
                    <View style={styles.imageActContainer}>
                      <FastImage style={styles.imageAction} source={ExitGroup} />
                    </View>
                    <View>
                      <Text style={styles.textAct}>Exit Group</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onReportGroup} style={styles.buttonGroup}>
                    <View style={styles.imageActContainer}>
                      <FastImage style={styles.imageAction} source={ReportGroup} />
                    </View>
                    <View>
                      <Text style={styles.textAct}>Report Group</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </>
          }
          renderItem={({item, index}) => {
            return (
              <View style={styles.parentContact}>
                <ProfileContact
                  key={index}
                  item={item}
                  onPress={() => onContactPressed(item, params.from)}
                  fullname={getUsername(item)}
                  photo={item?.profilePicture}
                  showArrow={handleShowArrow(item)}
                  userId={signedProfileId}
                  ImageComponent={renderImageComponent(item)}
                  isYou={
                    item?.userId === signedProfileId ||
                    item?.userId === anonProfileId ||
                    item?.id === signedProfileId ||
                    item?.id === anonProfileId
                  }
                  from={params?.from}
                />
              </View>
            );
          }}
        />
      )}
      <ModalAction
        onCloseModal={handleCloseSelectUser}
        selectedUser={selectedUser}
        isOpen={openModal}
        onPress={handlePressPopup}
        name={getUsername(selectedUser)}
        isLoadingInitChat={isLoadingInitChat}
        from={params?.from}
        isGroup={channelInfo?.channelType === CHANNEL_GROUP}
      />
      <ModalActionAnonymous
        name={
          selectedUser?.user?.name !== ANONYMOUS_USER
            ? selectedUser?.user?.name
            : selectedUser?.user?.username
        }
        isOpen={isAnonymousModalOpen}
        onCloseModal={handleCloseSelectUser}
        selectedUser={selectedUser}
        onPress={handlePressPopup}
      />
      <BlockComponent ref={blockModalRef} screen="group_info" />
    </SafeAreaView>
  );
};

export default ChatInfoScreen;
