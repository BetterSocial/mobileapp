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
import {useRoute} from '@react-navigation/core';

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
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';
import {getOfficialAnonUsername} from '../../utils/string/StringUtils';

export const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.white, paddingBottom: 40},
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
    color: COLORS.anon_primary
  },
  btnAdd: {
    padding: normalize(8),
    backgroundColor: COLORS.lightgrey,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 8,
    alignSelf: 'center',
    bottom: 5
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
    marginLeft: 20,
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    lineHeight: normalizeFontSize(16.94),
    color: COLORS.black,
    marginTop: 4,
    marginBottom: 9
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
    backgroundColor: COLORS.lightgrey,
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
    paddingTop: 8,
    paddingBottom: 13
  },
  btnUpdatePhoto: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    backgroundColor: COLORS.lightgrey,
    justifyContent: 'center',
    alignItems: 'center'
  },
  groupProfilePicture: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    paddingLeft: 8
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(20)
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
    backgroundColor: COLORS.lightgrey
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
    color: COLORS.redalert,
    fontSize: 14
  },
  mr7: {
    marginRight: dimen.normalizeDimen(12)
  },
  imageUser: {
    height: normalize(48),
    width: normalize(48),
    borderRadius: normalize(24)
  },
  parentContact: {
    height: normalize(72)
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
          size={normalize(100)}
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
            size={normalize(48)}
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
      <StatusBar translucent={false} />
      {loadingChannelInfo ? null : (
        <FlatList
          testID="participants"
          data={channelInfo?.memberUsers}
          keyExtractor={(_, index) => index?.toString()}
          ListHeaderComponent={getHeaderComponent}
          ListFooterComponent={
            <>
              {isLoadingFetchingChannelDetail ? <ActivityIndicator style={styles.loading} /> : null}
              <View style={styles.gap} />
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
