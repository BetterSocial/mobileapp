/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import FastImage from 'react-native-fast-image';
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
import {useRoute} from '@react-navigation/core';

import AnonymousChatInfoHeader from '../../components/Header/AnonymousChatInfoHeader';
import AnonymousIcon from '../ChannelListScreen/elements/components/AnonymousIcon';
import BlockComponent from '../../components/BlockComponent';
import ChannelImage from '../../components/ChatList/elements/ChannelImage';
import ModalAction from '../GroupInfo/elements/ModalAction';
import ModalActionAnonymous from '../GroupInfo/elements/ModalActionAnonymous';
import dimen from '../../utils/dimen';
import useChatInfoScreenHook from '../../hooks/screen/useChatInfoHook';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import {CHANNEL_GROUP, GROUP_INFO, SIGNED} from '../../hooks/core/constant';
import {Context} from '../../context';
import {Loading} from '../../components';
import {ProfileContact} from '../../components/Items';
import {colors} from '../../utils/colors';
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';
import {getChatName} from '../../utils/string/StringUtils';
import {isContainUrl} from '../../utils/Utils';
import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import {channelImageStyles} from '../../components/ChatList/elements/ChannelImage.style';
import useProfileHook from '../../hooks/core/profile/useProfileHook';

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
  countUser: (from: string) => ({
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(16.94),
    color: from === SIGNED ? colors.darkBlue : colors.holytosca,
    marginLeft: dimen.normalizeDimen(20),
    marginBottom: dimen.normalizeDimen(4),
    fontWeight: 'bold'
  }),
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
    lineHeight: normalizeFontSize(29.05),
    color: '#000',
    paddingHorizontal: dimen.normalizeDimen(20),
    fontWeight: 'bold'
  },
  lineTop: {
    backgroundColor: colors.alto,
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
    backgroundColor: '#E0E0E0'
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
    marginRight: dimen.normalizeDimen(12)
  },
  imageUser: {
    height: normalize(48),
    width: normalize(48),
    borderRadius: normalize(24)
  },
  parentContact: {
    height: normalize(72)
  },
  editBtn: {
    padding: dimen.normalizeDimen(10),
    marginRight: dimen.normalizeDimen(10),
    width: '15%'
  },
  chatNameContainer: {
    width: '85%'
  }
});

const ChatInfoScreen = () => {
  const {
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
    goToEditGroup
  } = useChatInfoScreenHook();
  const [isLoadingMembers] = React.useState<boolean>(false);
  const {signedProfileId} = useUserAuthHook();
  const [profile] = (React.useContext(Context) as unknown as any).profile;
  const {params}: any = useRoute();
  const isEditable = channelInfo?.rawJson?.channel?.channelType === 1;
  const ANONYMOUS_USER = 'AnonymousUser';
  const {anon_user_info_color_code, anon_user_info_emoji_code} =
    channelInfo?.rawJson?.channel || {};
  const {anonProfileId} = useProfileHook();
  const memberChat = channelInfo?.rawJson?.channel?.members?.find(
    (item: any) => item.user_id !== anonProfileId
  );
  const betterSocialMember = channelInfo?.rawJson?.better_channel_member;
  const showImageProfile = (): React.ReactNode => {
    if (channelInfo?.channelType === CHANNEL_GROUP) {
      return (
        <ChannelImage>
          <ChannelImage.Big
            style={channelImageStyles.containerImageGroupINfo}
            type={GROUP_INFO}
            image={channelInfo?.channelPicture}
          />
        </ChannelImage>
      );
    }
    if (anon_user_info_color_code) {
      return (
        <AnonymousIcon
          color={anon_user_info_color_code}
          emojiCode={anon_user_info_emoji_code}
          size={normalize(100)}
        />
      );
    }
    return (
      <Image
        testID="image1"
        style={styles.btnUpdatePhoto}
        source={{uri: channelInfo?.channelPicture}}
      />
    );
  };

  const renderImageComponent = (item) => {
    if (!isContainUrl(item?.user?.image) || item?.user?.name === ANONYMOUS_USER) {
      return (
        <View style={styles.mr7}>
          {betterSocialMember &&
          item.user_id === betterSocialMember[memberChat?.user_id]?.user_id ? (
            <AnonymousIcon
              color={betterSocialMember[memberChat?.user_id]?.anon_user_info_color_code}
              emojiCode={betterSocialMember[memberChat?.user_id]?.anon_user_info_emoji_code}
              size={normalize(48)}
            />
          ) : (
            <AnonymousIcon
              color={anon_user_info_color_code}
              emojiCode={anon_user_info_emoji_code}
              size={normalize(48)}
            />
          )}
        </View>
      );
    }
    return (
      <View style={styles.mr7}>
        <FastImage style={styles.imageUser} source={{uri: item?.user?.image}} />
      </View>
    );
  };

  const countParticipat = () => {
    return `(${channelInfo?.members?.length})`;
  };

  const handleWidthChatName = () => {
    if (params?.from === SIGNED) {
      return styles.chatNameContainer;
    }
    return {};
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} translucent={false} />
      {isLoadingMembers || loadingChannelInfo ? null : (
        <>
          <AnonymousChatInfoHeader
            isCenter
            onPress={goBack}
            title={`${getChatName(channelInfo?.name, profile?.myProfile?.username)}`}
          />
          <View style={styles.lineTop} />
          <ScrollView nestedScrollEnabled={true}>
            <SafeAreaView>
              <TouchableOpacity testID="imageClick">
                <View style={styles.containerPhoto}>{showImageProfile()}</View>
              </TouchableOpacity>
              <View style={styles.row}>
                <View style={styles.column}>
                  <View style={styles.containerGroupName}>
                    <View style={handleWidthChatName()}>
                      <Text numberOfLines={1} style={styles.groupName}>
                        {getChatName(channelInfo?.name, profile?.myProfile?.username)}
                      </Text>
                    </View>
                    {params?.from === SIGNED && isEditable ? (
                      <TouchableOpacity style={styles.editBtn} onPress={goToEditGroup}>
                        <MemoIc_pencil
                          height={dimen.normalizeDimen(20)}
                          width={dimen.normalizeDimen(20)}
                          color={colors.darkBlue}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <Text style={styles.dateCreate}>
                    Created {moment(channelInfo?.createdAt).format('MM/DD/YYYY')}
                  </Text>
                </View>
              </View>
              <View style={styles.lineTop} />
              <View style={styles.lineTop} />
              <View style={styles.users}>
                <Text style={styles.countUser(params?.from)}>Participants {countParticipat()}</Text>
                <FlatList
                  testID="participants"
                  data={channelInfo?.rawJson?.channel?.members}
                  keyExtractor={(item, index) => index?.toString()}
                  renderItem={({item, index}) => (
                    <View style={styles.parentContact}>
                      <ProfileContact
                        key={index}
                        item={item}
                        onPress={() => onContactPressed(item, params.from)}
                        fullname={item?.user?.name || item?.user?.username}
                        photo={item?.user?.profilePicture}
                        showArrow={handleShowArrow(item)}
                        userId={signedProfileId}
                        ImageComponent={renderImageComponent(item)}
                        from={params?.from}
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
      <ModalAction
        onCloseModal={handleCloseSelectUser}
        selectedUser={selectedUser}
        isOpen={openModal}
        onPress={handlePressPopup}
        name={selectedUser?.user?.username || selectedUser?.user?.name}
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