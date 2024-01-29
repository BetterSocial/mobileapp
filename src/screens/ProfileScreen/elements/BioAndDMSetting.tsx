/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Pressable, Platform} from 'react-native';
import ToastMessage from 'react-native-toast-message';
import CheckBox, {CheckBoxBase} from '@react-native-community/checkbox';
import TextAreaChat from '../../../components/TextAreaChat';
import ToggleSwitch from '../../../components/ToggleSwitch';
import {profileSettingsDMpermission} from '../../../service/profile';
import {addDotAndRemoveNewline} from '../../../utils/string/TrimString';
import {COLORS} from '../../../utils/theme';
import {PencilIcon} from '../../../assets';

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
          fontWeight: '500'
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
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: COLORS.white,
                  marginLeft: 4
                }}>
                Edit
              </Text>
            </View>
          </Pressable>
        </View>
        <View style={[styles.horizontalLine, {marginVertical: 12}]} />
        <Text style={styles.bioText}>{addDotAndRemoveNewline(bio)}</Text>
      </View>
      <View
        style={{
          backgroundColor: COLORS.white,
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
          borderColor: COLORS.gray
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
          <CheckBoxCustom value={isAnonymity} label="Allow anonymous messages?" />
        </TouchableOpacity>

        {isAnonymity && (
          <>
            <View
              style={[
                styles.horizontalLine,
                {marginTop: 6, marginBottom: 6, backgroundColor: COLORS.gray}
              ]}
            />
            <TouchableOpacity onPress={toggleSwitchAnonAllowFollowing}>
              <CheckBoxCustom
                value={isAllowFollowingSendDM}
                label="Only allow anon DMs from users you follow?"
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
    color: COLORS.white
  },
  container: {
    backgroundColor: COLORS.default_signed_secondary,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10,
    paddingBottom: 50
  },
  editPromptLabel: {color: COLORS.signed_secondary, textDecorationLine: 'underline'},
  bioText: {
    color: COLORS.lightgrey,
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: Platform.OS === 'android' ? '700' : '600',
    lineHeight: 22,
    marginBottom: 12
  },
  horizontalLine: {
    width: '100%',
    height: 0.5,
    backgroundColor: COLORS.white
  }
});

export default BioAndDMSetting;
