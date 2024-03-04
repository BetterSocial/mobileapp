import * as React from 'react';
import PropTypes from 'prop-types';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import TextAreaChat from '../../../components/TextAreaChat';
import ToggleSwitch from '../../../components/ToggleSwitch';
import useSaveAnonChatHook from '../../../database/hooks/useSaveAnonChatHook';
import {ANON_PM, SIGNED} from '../../../hooks/core/constant';
import {COLORS} from '../../../utils/theme';
import {Loading} from '../../../components';
import {fonts} from '../../../utils/fonts';
import {sendAnonymousDMOtherProfile, sendSignedDMOtherProfile} from '../../../service/chat';

const CHANNEL_BLOCKED = 'Channel is blocked';

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
    isAnonimityEnabled
  } = props;
  const navigation = useNavigation();
  const {saveChatFromOtherProfile, savePendingChatFromOtherProfile} = useSaveAnonChatHook();
  const [dmChat, setDmChat] = React.useState('');
  const [loadingSendDM, setLoadingSendDM] = React.useState(false);

  React.useEffect(() => {
    setDmChat('');
  }, [isSignedMessageEnabled]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setTimeout(() => {
        setDmChat('');
        setLoadingSendDM(false);
      }, 500);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendSignedDM = async () => {
    try {
      setLoadingSendDM(true);
      const signedMParams = {
        user_id: dataMain.user_id,
        message: dmChat
      };
      const response = await sendSignedDMOtherProfile(signedMParams);
      const newResponse = {...response, members: response?.message?.members};
      await saveChatFromOtherProfile(newResponse, 'sent', true, SIGNED);
    } catch (error) {
      setLoadingSendDM(false);
      if (__DEV__) {
        console.log(error, 'error');
      }
    }
  };

  const sentAnonDM = async () => {
    try {
      setLoadingSendDM(true);
      const {
        anon_user_info_emoji_name,
        anon_user_info_emoji_code,
        anon_user_info_color_name,
        anon_user_info_color_code
      } = anonProfile ?? {};

      const anonDMParams = {
        user_id: dataMain.user_id,
        message: dmChat,
        anon_user_info_emoji_name,
        anon_user_info_emoji_code,
        anon_user_info_color_name,
        anon_user_info_color_code
      };
      const response = await sendAnonymousDMOtherProfile(anonDMParams);
      await saveChatFromOtherProfile(response, 'sent', true, ANON_PM);
    } catch (e) {
      if (e?.response?.data?.status === CHANNEL_BLOCKED) {
        const response = e?.response?.data?.data;
        await savePendingChatFromOtherProfile(response, 'pending', true, ANON_PM);
        return;
      }

      setLoadingSendDM(false);
    }
  };

  const onSendDM = async () => {
    if (isAnonimity) {
      await sentAnonDM();
    } else {
      await sendSignedDM();
    }
  };

  return (
    <View style={styles.bioAndSendChatContainer(isAnonimity)}>
      <Loading visible={loadingSendDM} />
      <View style={styles.containerBio}>
        {bio === null || bio === undefined ? (
          <Text style={styles.bioText}>Send a message</Text>
        ) : (
          <Pressable onPress={openBio}>
            <Text linkStyle={styles.seeMore} style={styles.bioText}>
              {bio}
            </Text>
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
          disabledButton={loadingSendDM || !isSignedMessageEnabled || loadingGenerateAnon}
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
          styleLabelLeft={{color: COLORS.white}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bioAndSendChatContainer: (isAnonimity) => ({
    backgroundColor: isAnonimity ? COLORS.anon_primary : COLORS.signed_primary,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingTop: 10
  }),
  containerBio: {
    marginBottom: 10
  },
  bioText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22
  },
  seeMore: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: COLORS.black
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
