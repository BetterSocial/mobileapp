import * as React from 'react';
import PropTypes from 'prop-types';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import TextAreaChat from '../../../components/TextAreaChat';
import useSaveAnonChatHook from '../../../database/hooks/useSaveAnonChatHook';
import {ANON_PM, SIGNED} from '../../../hooks/core/constant';
import {fonts} from '../../../utils/fonts';
import {sendAnonymousDMOtherProfile, sendSignedDMOtherProfile} from '../../../service/chat';
import {trimString} from '../../../utils/string/TrimString';
import {ToggleSwitchAnon, useDynamicColors} from '../../../hooks/useToggleColors';
import {COLORS} from '../../../utils/theme';

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
  const {saveChatFromOtherProfile, savePendingChatFromOtherProfile} = useSaveAnonChatHook();
  const [dmChat, setDmChat] = React.useState('');
  const [loadingSendDM, setLoadingSendDM] = React.useState(false);
  const dynamicColors = useDynamicColors(isAnonimity);

  React.useEffect(() => {
    setDmChat('');
  }, [isSignedMessageEnabled]);

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
      setDmChat('');
    } catch (error) {
      if (__DEV__) {
        console.log(error, 'error');
      }
    } finally {
      setLoadingSendDM(false);
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
      setDmChat('');
    } catch (e) {
      if (e?.response?.data?.status === CHANNEL_BLOCKED) {
        const response = e?.response?.data?.data;
        await savePendingChatFromOtherProfile(response, true);
        setDmChat('');
        return;
      }
    } finally {
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
    <View style={styles.bioAndSendChatContainer(dynamicColors)}>
      <View style={styles.containerBio}>
        {bio === null || bio === undefined ? (
          <Text style={styles.bioText(dynamicColors)}>Send a message</Text>
        ) : (
          <Pressable onPress={openBio}>
            <Text linkStyle={styles.seeMore} style={styles.bioText(dynamicColors)}>
              {trimString(bio, 121)}{' '}
              {bio.length > 121 ? <Text style={{color: COLORS.blue}}>see more</Text> : null}
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
      <ToggleSwitchAnon
        value={isAnonimity}
        onValueChange={toggleSwitch}
        labelLeft={
          isAnonimityEnabled || !isSignedMessageEnabled ? 'Anonymity' : 'Anonymity disabled'
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bioAndSendChatContainer: (dynamicColors) => ({
    backgroundColor: dynamicColors.primary,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingTop: 10
  }),
  containerBio: {
    marginBottom: 10
  },
  bioText: (dynamicColors) => ({
    color: dynamicColors.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22
  }),
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
