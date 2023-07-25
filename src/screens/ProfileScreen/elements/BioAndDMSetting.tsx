/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Pressable, Platform} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import ToastMessage from 'react-native-toast-message';
import TextAreaChat from '../../../components/TextAreaChat';
import {colors} from '../../../utils/colors';
import {profileSettingsDMpermission} from '../../../service/profile';
import {addDotAndRemoveNewline} from '../../../utils/string/TrimString';

type BioAndDMSettingProps = {
  bio: string;
  avatarUrl: string;
  changeBio: () => void;
  following: number;
  allowAnonDm: boolean;
  onlyReceivedDmFromUserFollowing: boolean;
};

const BioAndDMSetting = ({
  bio,
  changeBio,
  avatarUrl,
  following,
  allowAnonDm,
  onlyReceivedDmFromUserFollowing
}: BioAndDMSettingProps) => {
  const [isAnonymity, setIsAnonymity] = React.useState(allowAnonDm);
  const [isAllowFollowingSendDM, setIsAllowFollowingSendDM] = React.useState(
    onlyReceivedDmFromUserFollowing
  );

  const updateProfileSetting = async () => {
    try {
      await profileSettingsDMpermission(isAnonymity, isAllowFollowingSendDM);
    } catch (error) {
      setIsAnonymity(allowAnonDm);
      setIsAllowFollowingSendDM(onlyReceivedDmFromUserFollowing);
    }
  };

  const toggleSwitchAnon = () => {
    setIsAnonymity((current) => !current);
    setIsAllowFollowingSendDM(false);
  };

  const toggleSwitchAnonAllowFollowing = () => {
    if (following >= 20) {
      setIsAllowFollowingSendDM((current) => !current);
    } else {
      ToastMessage.show({
        type: 'asNative',
        text1:
          "To protect your connections' anonymity, you need to follow at least 20 users to enable this option",
        position: 'bottom'
      });
    }
  };

  const handleClickTextArea = () => {
    ToastMessage.show({
      type: 'asNative',
      text1: 'You cannot send yourself messages.',
      position: 'bottom'
    });
  };

  const ref = React.useRef(true);

  React.useEffect(() => {
    if (ref.current) {
      ref.current = false;
    } else {
      updateProfileSetting();
    }
  }, [isAnonymity, isAllowFollowingSendDM]);

  const isBioEmpty = bio === null || bio === undefined;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => changeBio()} style={{paddingVertical: 12}}>
        {isBioEmpty ? (
          <Text style={styles.editPromptLabel}>Edit Prompt</Text>
        ) : (
          <Text style={styles.bioText}>
            {addDotAndRemoveNewline(bio)} <Text style={styles.editPromptLabel}>Edit Prompt</Text>
          </Text>
        )}
      </Pressable>

      <Pressable onPress={handleClickTextArea}>
        <View pointerEvents="none">
          <TextAreaChat
            isAnonimity={false}
            avatarUrl={avatarUrl}
            loadingAnonUser={false}
            onChangeMessage={() => {}}
            onSend={() => {}}
            minHeight={55}
            disabledInput
            placeholder="From here, others can message you, for example replying to your prompt above."
          />
        </View>
      </Pressable>

      <TouchableOpacity onPress={toggleSwitchAnon} style={styles.toggleSwitchAnon}>
        <ToggleSwitch
          isOn={isAnonymity}
          onToggle={toggleSwitchAnon}
          onColor={'#9DEDF1'}
          circleColor={isAnonymity ? '#00ADB5' : colors.white}
          label={'Allow anonymous messages? '}
          offColor="#F5F5F5"
          size="small"
          labelStyle={styles.toggleLabel}
        />
      </TouchableOpacity>

      {isAnonymity && (
        <TouchableOpacity
          onPress={toggleSwitchAnonAllowFollowing}
          style={styles.toggleSwitchAnonFollowing}>
          <ToggleSwitch
            isOn={isAllowFollowingSendDM}
            onToggle={toggleSwitchAnonAllowFollowing}
            onColor={'#9DEDF1'}
            label={'Only allow anon DMs from users you follow?'}
            offColor="#F5F5F5"
            circleColor={isAllowFollowingSendDM ? '#00ADB5' : colors.white}
            size="small"
            labelStyle={styles.toggleLabelFollowingDM}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
    borderRadius: 15,
    paddingHorizontal: 12,
    marginTop: 20
  },
  editPromptLabel: {color: colors.blueSea10, textDecorationLine: 'underline'},
  bioText: {
    color: '#F5F5F5',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: Platform.OS === 'android' ? '700' : '600',
    lineHeight: 22
  },
  toggleLabel: {color: colors.white, marginRight: 2, fontSize: 12},
  toggleLabelFollowingDM: {color: colors.white, marginRight: 5, fontSize: 12},
  toggleSwitchAnon: {display: 'flex', alignSelf: 'flex-end', paddingVertical: 12},
  toggleSwitchAnonFollowing: {display: 'flex', alignSelf: 'flex-end', paddingBottom: 12}
});

export default BioAndDMSetting;
