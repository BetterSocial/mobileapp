/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import SimpleToast from 'react-native-simple-toast';
import TextAreaChat from '../../../components/TextAreaChat';
import {colors} from '../../../utils/colors';
import GlobalButton from '../../../components/Button/GlobalButton';
import {trimString} from '../../../utils/string/TrimString/index';

type BioAndDMSettingProps = {
  bio: string;
  avatarUrl: string;
  changeBio: () => void;
  following: number;
};

const BioAndDMSetting: React.FC<BioAndDMSettingProps> = ({
  bio,
  changeBio,
  avatarUrl,
  following
}) => {
  const [isAnonimity, setIsAnonimity] = React.useState(false);
  const [isAllowFollowingSendDM, setIsAllowFollowingSendDM] = React.useState(false);

  const toggleSwitchAnon = () => {
    setIsAnonimity((current) => !current);
    setIsAllowFollowingSendDM(false);
  };
  const toggleSwitchAnonAllowFollowing = () => {
    if (following >= 20) {
      setIsAllowFollowingSendDM((current) => !current);
    } else {
      SimpleToast.show(
        'To protect your connections anonymity, you need to follow at least 20 users to enable this option',
        SimpleToast.LONG
      );
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.darkBlue,
        borderRadius: 15,
        paddingHorizontal: 10,
        marginTop: 18
      }}>
      <GlobalButton onPress={() => changeBio()}>
        <>
          {bio === null || bio === undefined ? (
            <Text style={{color: colors.darkBlue}}>Add Bio</Text>
          ) : (
            <Text style={{color: colors.white, fontSize: 14}}>
              {trimString(bio, 121)}{' '}
              {bio.length > 121 ? <Text style={{color: colors.darkBlue}}>see more</Text> : null}
            </Text>
          )}
        </>
      </GlobalButton>

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
          isOn={isAnonimity}
          onToggle={toggleSwitchAnon}
          onColor={'#9DEDF1'}
          label={'Allow anonymous messages? '}
          offColor="#F5F5F5"
          size="small"
          labelStyle={{color: colors.white, marginRight: 2, fontSize: 12}}
        />
      </TouchableOpacity>
      {isAnonimity && (
        <TouchableOpacity
          onPress={toggleSwitchAnonAllowFollowing}
          style={styles.toggleSwitchAnonFollowing}>
          <ToggleSwitch
            isOn={isAllowFollowingSendDM}
            onToggle={toggleSwitchAnonAllowFollowing}
            onColor={'#9DEDF1'}
            label={'Only allow anon DMs from users you follow?'}
            offColor="#F5F5F5"
            size="small"
            labelStyle={{color: colors.white, marginRight: 5, fontSize: 12}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BioAndDMSetting;

const styles = StyleSheet.create({
  toggleSwitchAnon: {display: 'flex', alignSelf: 'flex-end', paddingVertical: 8},
  toggleSwitchAnonFollowing: {display: 'flex', alignSelf: 'flex-end', paddingBottom: 8}
});
