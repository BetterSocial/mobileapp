import React, {forwardRef, Ref} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import IconClose from '../../../assets/icon/IconClose';
import {BottomSheetV2} from '../../../components/BottomSheet';
import dimen from '../../../utils/dimen';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import {Button} from '../../../components/Button';
import IconCheckCircleOutline from '../../../assets/icon/IconCheckCircleOutline';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';
import ProfilePicture from '../../ProfileScreen/elements/ProfilePicture';
import IconIncognito from '../../../assets/icon/IconIncognito';

export type Follow = 'signed' | 'incognito' | '';

interface BottomSheetFollowProps {
  username: string;
  profilePicture: string;
  topicName: string;
  isFollow: boolean;
  setIsFollow: (isFollow: boolean) => void;
  memberCount: number;
  setMemberCount: (memberCount: number) => void;
  onClose: () => void;
  getTopicDetail: (topicName: string) => void;
  followType: Follow;
  setFollowType: (followType: Follow) => void;
  ref: Ref<RBSheet>;
}

type UserItemProps = {
  type: 'signed' | 'incognito';
  username: string;
  profilePicture: string;
  isFollowing: boolean;
  onPress?: () => void;
};

const UserItem = ({type, username, profilePicture, isFollowing, onPress}: UserItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: dimen.normalizeDimen(14),
        paddingHorizontal: dimen.normalizeDimen(20),
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 1
      }}>
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <View
            style={{
              marginRight: 8
            }}>
            {type === 'signed' ? (
              <ProfilePicture
                size={20}
                width={0}
                profilePicPath={profilePicture}
                anonBackgroundColor=""
                anonEmojiCode=""
              />
            ) : (
              <IconIncognito color={COLORS.white} />
            )}
          </View>
          <Text
            style={{
              fontFamily: fonts.inter[400],
              fontSize: 14,
              color: COLORS.black
            }}>
            {type === 'signed' ? `as @${username}` : 'Incognito'}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fonts.inter[400],
            fontSize: 12,
            color: COLORS.blackgrey,
            marginTop: 4,
            lineHeight: 18
          }}>
          {type === 'signed'
            ? 'You’ll be visible as a community member.'
            : 'You’ll be a hidden member of the community.'}
        </Text>
      </View>
      {isFollowing && (
        <IconCheckCircleOutline
          color={type === 'signed' ? COLORS.signed_primary : COLORS.anon_primary}
        />
      )}
    </TouchableOpacity>
  );
};

const BottomSheetFollow = forwardRef((props: BottomSheetFollowProps, ref: Ref<RBSheet>) => {
  const {
    topicName,
    memberCount,
    setMemberCount,
    isFollow,
    setIsFollow,
    followType,
    setFollowType,
    getTopicDetail,
    onClose
  } = props;
  const {followTopic} = useChatClientHook();
  const handleFollowTopic = async ({type}: {type: Follow}) => {
    if (isFollow) {
      if (followType === '') {
        setMemberCount(memberCount - 1);
      }
    } else {
      setMemberCount(memberCount + 1);
    }
    onClose();
    if (type === 'signed') {
      if (followType === '' || followType === 'incognito') {
        setFollowType('signed');
        setIsFollow(true);
        try {
          await followTopic(topicName, false);
          getTopicDetail(topicName);
        } catch (error) {
          if (__DEV__) {
            console.log(error);
          }
        }
      }
    } else if (type === 'incognito') {
      if (followType === '' || followType === 'signed') {
        setFollowType('incognito');
        setIsFollow(true);
        try {
          await followTopic(topicName, true);
          getTopicDetail(topicName);
        } catch (error) {
          if (__DEV__) {
            console.log(error);
          }
        }
      }
    }
  };

  const handleUnfollowTopic = async ({type}: {type: Follow}) => {
    setFollowType('');
    setIsFollow(false);
    setMemberCount(memberCount - 1);
    onClose();
    try {
      const isIncognito = type === 'incognito';
      await followTopic(topicName, isIncognito);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  };

  return (
    <View>
      <BottomSheetV2
        ref={ref}
        closeOnPressMask={true}
        height={290}
        keyboardAvoidingViewEnabled={true}
        viewstyle={{
          paddingHorizontal: 0,
          paddingTop: 0
        }}>
        <View style={styles.containerBottomSheet}>
          <View style={styles.titleContainer}>
            <View
              style={{
                width: 12,
                height: 12
              }}
            />
            <Text style={styles.title}>Join as</Text>

            <TouchableOpacity onPress={onClose}>
              <IconClose color={COLORS.black} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderTopColor: COLORS.gray,
              borderTopWidth: 1
            }}
          />
          <UserItem
            type="signed"
            username={props.username}
            profilePicture={props.profilePicture}
            isFollowing={followType === 'signed'}
            onPress={() => {
              handleFollowTopic({
                type: 'signed'
              });
            }}
          />
          <UserItem
            type="incognito"
            username="Incognito"
            profilePicture=""
            isFollowing={followType === 'incognito'}
            onPress={() => {
              handleFollowTopic({
                type: 'incognito'
              });
            }}
          />
          <View
            style={{
              paddingVertical: dimen.normalizeDimen(14),
              paddingHorizontal: dimen.normalizeDimen(20)
            }}>
            <Button
              onPress={() => {
                handleUnfollowTopic({
                  type: followType
                });
              }}
              disabled={followType === ''}
              styles={{
                backgroundColor: COLORS.white,
                paddingVertical: dimen.normalizeDimen(11),
                paddingHorizontal: dimen.normalizeDimen(20),
                borderRadius: dimen.normalizeDimen(8),
                height: dimen.normalizeDimen(40),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: isFollow ? COLORS.redalert : COLORS.light_silver,
                borderWidth: 1
              }}
              textStyling={{
                fontFamily: fonts.inter[500],
                fontWeight: 'normal',
                fontSize: 12,
                color: isFollow ? COLORS.redalert : COLORS.white
              }}>
              Leave Community
            </Button>
          </View>
        </View>
      </BottomSheetV2>
    </View>
  );
});

BottomSheetFollow.displayName = 'BottomSheetFollow';

const styles = StyleSheet.create({
  containerBottomSheet: {
    flexDirection: 'column',
    marginBottom: dimen.normalizeDimen(20)
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingVertical: dimen.normalizeDimen(10)
  },
  title: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.black
  },
  description: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.blackgrey,
    marginTop: 7
  },
  errorText: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.redalert,
    marginTop: dimen.normalizeDimen(7)
  },
  button: {
    marginTop: 33,
    backgroundColor: COLORS.signed_primary
  },
  textStyling: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: COLORS.white
  }
});

export default React.memo(BottomSheetFollow);
