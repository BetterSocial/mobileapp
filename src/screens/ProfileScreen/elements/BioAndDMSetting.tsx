/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Pressable, Platform} from 'react-native';
import ToastMessage from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';
import {profileSettingsDMpermission} from '../../../service/profile';
import {addDotAndRemoveNewline} from '../../../utils/string/TrimString';
import {COLORS} from '../../../utils/theme';
import {PencilIcon} from '../../../assets';
import {Divider} from '../../../components/Divider';
import {TextWithEmoji} from './TextWithEmoji';
import {fonts} from '../../../utils/fonts';

type BioAndDMSettingProps = {
  bio: string;
  avatarUrl: string;
  changeBio: () => void;
  following: number;
  allowAnonDm: boolean;
  onlyReceivedDmFromUserFollowing: boolean;
};

const CheckBoxCustom = (props: {value: boolean; label: string}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 9999,
          backgroundColor: COLORS.white,
          marginRight: 5
        }}>
        <CheckBox
          value={props.value}
          onCheckColor={COLORS.white}
          tintColors={{true: COLORS.signed_primary, false: COLORS.white}}
          tintColor={COLORS.signed_primary}
          onTintColor={COLORS.signed_primary}
          onFillColor={COLORS.signed_primary}
          style={{
            width: 16,
            height: 16
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 12,
          fontFamily: fonts.inter[500],
          color: COLORS.white2
        }}>
        {props.label}
      </Text>
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
      <View
        style={{
          backgroundColor: COLORS.almostBlack,
          borderRadius: 12,
          padding: 12,
          marginHorizontal: 12,
          shadowColor: 'rgba(0, 0, 0, 0.04)',
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 2,
          marginTop: -50,
          borderWidth: 1,
          // TODO: Garry, gray berapa?
          borderColor: COLORS.gray400
        }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '400',
            color: COLORS.gray500,
            marginBottom: 12
          }}>
          Other users will be able to reply to your prompt and direct message you.
        </Text>
        <TouchableOpacity onPress={toggleSwitchAnon}>
          <CheckBoxCustom value={isAnonymity} label="Allow messages from incognito users?" />
        </TouchableOpacity>

        {isAnonymity && (
          <>
            <Divider style={{marginVertical: 6, backgroundColor: COLORS.gray}} />
            <TouchableOpacity onPress={toggleSwitchAnonAllowFollowing}>
              <CheckBoxCustom
                value={isAllowFollowingSendDM}
                label="Allow incognito only from users you follow?"
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
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white2
  },
  container: {
    backgroundColor: COLORS.default_signed_secondary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10,
    paddingBottom: 50
  },
  editPromptLabel: {
    fontSize: 14,
    fontFamily: fonts.inter[500],
    color: COLORS.white2,
    marginLeft: 4
  },
  bioTextNull: {
    // TODO: Garry, gray berapa?
    color: COLORS.gray200,
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 12
  }
});

export default BioAndDMSetting;
