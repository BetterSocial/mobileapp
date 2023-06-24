/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import SimpleToast from 'react-native-simple-toast';
import TextAreaChat from '../../../components/TextAreaChat';
import {colors} from '../../../utils/colors';
import {trimString} from '../../../utils/string/TrimString/index';
import {profileSettingsDMpermission} from '../../../service/profile';

type BioAndDMSettingProps = {
  bio: string;
  avatarUrl: string;
  changeBio: () => void;
  following: number;
  allowAnonDm: boolean;
  onlyReceivedDmFromUserFollowing: boolean;
};

const BioAndDMSetting: React.FC<BioAndDMSettingProps> = ({
  bio,
  changeBio,
  avatarUrl,
  following,
  allowAnonDm,
  onlyReceivedDmFromUserFollowing
}) => {
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
      SimpleToast.show(
        'To protect your connections` anonymity, you need to follow at least 20 users to enable this option',
        SimpleToast.LONG
      );
    }
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
      <View style={{paddingVertical: 10}}>
        {isBioEmpty ? (
          <Text style={{color: colors.white}}>Add Bio</Text>
        ) : (
          <Text style={{color: colors.white, fontSize: 14}}>
            {trimString(bio, 121)}
            {'. '}
            {bio.length > 121 ? <Text style={{color: colors.white}}>see more</Text> : null}
            <Text onPress={() => changeBio()} style={styles.editPromptLabel}>
              Edit Prompt
            </Text>
          </Text>
        )}
      </View>

      <TextAreaChat
        isAnonimity={false}
        avatarUrl={avatarUrl}
        loadingAnonUser={false}
        onChangeMessage={() => {}}
        onSend={() => {}}
        height={55}
        disabledInput
        placeholder="Other users will be able to reply to your prompt and direct message you."
      />

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
    paddingHorizontal: 10,
    marginTop: 18
  },
  editPromptLabel: {color: colors.blueSea10, textDecorationLine: 'underline'},
  toggleLabel: {color: colors.white, marginRight: 2, fontSize: 12},
  toggleLabelFollowingDM: {color: colors.white, marginRight: 5, fontSize: 12},
  toggleSwitchAnon: {display: 'flex', alignSelf: 'flex-end', paddingVertical: 8},
  toggleSwitchAnonFollowing: {display: 'flex', alignSelf: 'flex-end', paddingBottom: 8}
});

export default React.memo(BioAndDMSetting);
