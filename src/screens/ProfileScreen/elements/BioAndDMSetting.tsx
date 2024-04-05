/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import CheckBox from '@react-native-community/checkbox';
import ToastMessage from 'react-native-toast-message';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {COLORS} from '../../../utils/theme';
import {Divider} from '../../../components/Divider';
import {PencilIcon} from '../../../assets';
import {TextWithEmoji} from './TextWithEmoji';
import {fonts, normalizeFontSize, fonts, normalizeFontSize} from '../../../utils/fonts';
import {addDotAndRemoveNewline} from '../../../utils/string/TrimString';
import {profileSettingsDMpermission} from '../../../service/profile';
import dimen from '../../../utils/dimen';

type BioAndDMSettingProps = {
  bio: string;
  avatarUrl: string;
  changeBio: () => void;
  following: number;
  allowAnonDm: boolean;
  onlyReceivedDmFromUserFollowing: boolean;
};

const CheckBoxCustom = (props: {value: boolean; label: string; disabled?: boolean}) => {
  return (
    <View style={styles.checkboxItem}>
      <View style={styles.checkboxItemContent}>
        <CheckBox
          disabled={props.disabled || false}
          value={props.value}
          onCheckColor={COLORS.gray110}
          tintColors={{true: COLORS.signed_primary, false: COLORS.gray110}}
          tintColor={COLORS.signed_primary}
          onTintColor={COLORS.signed_primary}
          onFillColor={COLORS.signed_primary}
          style={styles.checkbox}
          aria-checked={props.value}
          onValueChange={() => {}}
        />
      </View>
      <Text style={styles.checkboxLabel}>{props.label}</Text>
    </View>
  );
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
    if (isAllowFollowingSendDM) {
      setIsAllowFollowingSendDM(() => false);
      return;
    }

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

  const ref = React.useRef(true);

  React.useEffect(() => {
    if (ref.current) {
      ref.current = false;
    } else {
      updateProfileSetting();
    }
  }, [isAnonymity, isAllowFollowingSendDM]);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.promptTitleContainer}>
          <Text style={styles.promptTitle}>My Prompt</Text>
          <Pressable onPress={() => changeBio()}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <PencilIcon />
              <Text style={styles.editPromptLabel}>Edit</Text>
            </View>
          </Pressable>
        </View>
        <Divider
          style={{
            marginVertical: 12
          }}
        />
        {!bio ? (
          <Text style={styles.bioTextNull}>
            What should others message you about? Add your bio and conversation starters here.
          </Text>
        ) : (
          <TextWithEmoji text={addDotAndRemoveNewline(bio || '')} />
        )}
      </View>
      <View style={styles.allowContainer}>
        <Text style={styles.allowDescText}>
          Other users will be able to reply to your prompt and direct message you.
        </Text>
        <TouchableOpacity onPress={toggleSwitchAnon}>
          <CheckBoxCustom value={isAnonymity} label="Allow messages from incognito users?" />
        </TouchableOpacity>

        {isAnonymity && (
          <>
            <Divider style={{marginVertical: 6, backgroundColor: COLORS.gray210}} />
            <TouchableOpacity onPress={toggleSwitchAnonAllowFollowing}>
              <CheckBoxCustom
                value={isAllowFollowingSendDM}
                label="Allow incognito only from users you follow?"
                disabled={!isAllowFollowingSendDM && following < 20}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  promptTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  promptTitle: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[600],
    color: COLORS.white
  },
  container: {
    backgroundColor: COLORS.signed_secondary,
    borderRadius: dimen.normalizeDimen(16),
    paddingHorizontal: dimen.normalizeDimen(12),
    paddingVertical: dimen.normalizeDimen(12),
    marginTop: dimen.normalizeDimen(10),
    paddingBottom: dimen.normalizeDimen(50)
  },
  editPromptLabel: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[500],
    color: COLORS.white,
    marginLeft: dimen.normalizeDimen(4)
  },
  bioTextNull: {
    color: COLORS.white,
    fontFamily: fonts.inter[400],
    fontStyle: 'italic',
    lineHeight: normalizeFontSize(20),
    fontSize: normalizeFontSize(16),
    marginBottom: dimen.normalizeDimen(12)
  },
  allowContainer: {
    backgroundColor: COLORS.gray110,
    borderRadius: dimen.normalizeDimen(12),
    padding: dimen.normalizeDimen(12),
    marginHorizontal: dimen.normalizeDimen(12),
    marginTop: -50,
    borderWidth: 1,
    borderColor: COLORS.gray210
  },
  allowDescText: {
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[400],
    color: COLORS.gray510,
    marginBottom: dimen.normalizeDimen(12)
  },
  checkboxItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkboxItemContent: {
    width: dimen.normalizeDimen(16),
    height: dimen.normalizeDimen(16),
    borderRadius: 9999,
    backgroundColor: COLORS.almostBlack,
    marginRight: dimen.normalizeDimen(5)
  },
  checkbox: {
    width: dimen.normalizeDimen(16),
    height: dimen.normalizeDimen(16),
    backgroundColor: COLORS.gray110
  },
  checkboxLabel: {
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[500],
    color: COLORS.white
  }
});

export default BioAndDMSetting;
