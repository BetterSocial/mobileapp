import * as React from 'react';
import PropTypes from 'prop-types';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import MemoLinkDetectionText from '../../../components/Text/LinkDetectionText';
import TextAreaChat from '../../../components/TextAreaChat';
import ToggleSwitch from '../../../components/ToggleSwitch';
import useSaveAnonChatHook from '../../../database/hooks/useSaveAnonChatHook';
import {COLORS} from '../../../utils/theme';
import {Loading} from '../../../components';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

const BioAndChat = (props) => {
  const {
    isAnonimity,
    bio,
    openBio,
    dataMain,
    isSignedMessageEnabled,
    showSignedMessageDisableToast,
    loadingGenerateAnon,
    avatarUrl,
    anonProfile,
    username,
    toggleSwitch,
    isAnonimityEnabled,
    eventTrack = {
      onBioSendDm: () => {}
    }
  } = props;
  const navigation = useNavigation();
  const {isLoadingSendDm, sendChatFromOtherProfileV2, setIsLoadingSendDm} =
    useSaveAnonChatHook(eventTrack);
  const [dmChat, setDmChat] = React.useState('');

  React.useEffect(() => {
    setDmChat('');
  }, [isSignedMessageEnabled]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setTimeout(() => {
        setDmChat('');
        setIsLoadingSendDm(false);
      }, 500);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onSendDM = async () => {
    try {
      await sendChatFromOtherProfileV2({
        isAnonymous: isAnonimity,
        targetUserId: dataMain.user_id,
        message: dmChat,
        anonUserInfo: anonProfile,
        channelIdAsSignedUser: dataMain?.signedChannelIdWithTargetUser,
        channelIdAsAnonUser: dataMain?.anonymousChannelIdWithTargetUser
      });
    } catch (e) {
      console.log('error send dm', e);
    }
  };

  return (
    <View style={styles.bioAndSendChatContainer}>
      <Loading visible={isLoadingSendDm} />
      <View style={styles.containerBio}>
        {bio === null || bio === undefined || bio === '' ? (
          <Text style={styles.bioText}>Send a message</Text>
        ) : (
          <Pressable onPress={openBio}>
            <MemoLinkDetectionText text={bio} parentTextStyle={styles.bioText} />
          </Pressable>
        )}
      </View>
      <TouchableOpacity
        disabled={isSignedMessageEnabled}
        activeOpacity={1}
        onPress={showSignedMessageDisableToast}>
        <TextAreaChat
          isAnonimity={isAnonimity}
          loadingAnonUser={loadingGenerateAnon}
          avatarUrl={avatarUrl}
          anonUser={anonProfile}
          placeholder="Send a direct message"
          disabledInput={!isSignedMessageEnabled}
          onSend={onSendDM}
          onChangeMessage={setDmChat}
          disabledButton={isLoadingSendDm || !isSignedMessageEnabled || loadingGenerateAnon}
          defaultValue={
            isSignedMessageEnabled ? dmChat : `Only users ${username} follows can send messages`
          }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleSwitch} style={styles.toggleSwitchContainer}>
        <ToggleSwitch
          value={isAnonimity}
          onValueChange={toggleSwitch}
          labelLeft={
            isAnonimityEnabled || !isSignedMessageEnabled ? 'Incognito' : 'Incognito disabled'
          }
          styleLabelLeft={{
            color: isAnonimity ? COLORS.anon_primary : COLORS.signed_primary,
            fontSize: normalizeFontSize(12)
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bioAndSendChatContainer: {
    backgroundColor: COLORS.gray110,
    borderWidth: 1,
    borderColor: COLORS.gray210,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingTop: 10
  },
  containerBio: {
    marginBottom: 10
  },
  bioText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: fonts.inter[600],
    lineHeight: 22
  },
  seeMore: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: COLORS.white
  },
  toggleSwitchContainer: {
    display: 'flex',
    alignSelf: 'flex-end',
    paddingVertical: 10
  }
});

BioAndChat.propTypes = {
  isAnonimity: PropTypes.bool,
  bio: PropTypes.string,
  openBio: PropTypes.bool,
  dataMain: PropTypes.object.isRequired,
  isSignedMessageEnabled: PropTypes.bool,
  showSignedMessageDisableToast: PropTypes.bool,
  loadingGenerateAnon: PropTypes.bool,
  avatarUrl: PropTypes.string,
  anonProfile: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  toggleSwitch: PropTypes.func.isRequired,
  isAnonimityEnabled: PropTypes.bool
};

export default BioAndChat;
