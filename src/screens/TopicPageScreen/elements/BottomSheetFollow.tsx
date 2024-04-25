import React, {forwardRef, Ref} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import IconClose from '../../../assets/icon/IconClose';
import {BottomSheetV2} from '../../../components/BottomSheet';
import {Button} from '../../../components/Button';
import dimen from '../../../utils/dimen';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';
import {COLORS} from '../../../utils/theme';
import useDiscovery from '../../DiscoveryScreenV2/hooks/useDiscovery';
import UserItem from './UserItem';

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
  followType: Follow;
  setFollowType: (followType: Follow) => void;
  topicId: string;
}

const BottomSheetFollow = forwardRef((props: BottomSheetFollowProps, ref: Ref<RBSheet>) => {
  const {
    topicId,
    topicName,
    memberCount,
    setMemberCount,
    isFollow,
    setIsFollow,
    followType,
    setFollowType,
    onClose
  } = props;
  const {followTopic} = useChatClientHook();
  const {updateFollowTopicDiscoveryContext} = useDiscovery();

  const handleFollowTopic = async ({type: followTypeParam}: {type: Follow}) => {
    const isIncognito = followTypeParam === 'incognito';

    const followTypeCheck = (targetType: Follow) => followType === targetType || followType === '';

    const follow = async (type: Follow) => {
      setFollowType(type);
      setIsFollow(true);
      try {
        await followTopic(topicName, isIncognito);
        updateFollowTopicDiscoveryContext(true, {topic_id: topicId}, true);
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
      }
    };

    onClose();

    if (isFollow) {
      if (followTypeCheck('')) {
        setMemberCount(memberCount - 1);
      }
    } else {
      setMemberCount(memberCount + 1);
    }

    if (followTypeParam === 'signed' && followTypeCheck('incognito')) {
      follow('signed');
    } else if (followTypeParam === 'incognito' && followTypeCheck('signed')) {
      follow('incognito');
    }
  };

  const handleUnfollowTopic = async ({type}: {type: Follow}) => {
    setFollowType('');
    setIsFollow(false);
    setMemberCount(memberCount - 1);
    onClose();
    updateFollowTopicDiscoveryContext(false, {topic_id: topicName}, true);

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
              borderTopColor: COLORS.gray210,
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
              styles={styles.buttonContainer(isFollow)}
              textStyling={styles.button(isFollow)}>
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
    fontSize: normalizeFontSize(16),
    color: COLORS.black
  },
  description: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    color: COLORS.gray410,
    marginTop: dimen.normalizeDimen(7)
  },
  errorText: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    color: COLORS.redalert,
    marginTop: dimen.normalizeDimen(7)
  },
  buttonContainer: (isFollow: boolean) => ({
    backgroundColor: COLORS.almostBlack,
    paddingVertical: dimen.normalizeDimen(11),
    paddingHorizontal: dimen.normalizeDimen(20),
    borderRadius: dimen.normalizeDimen(8),
    height: dimen.normalizeDimen(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: isFollow ? COLORS.redalert : COLORS.gray110,
    borderWidth: 1
  }),
  button: (isFollow: boolean) => ({
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(12),
    color: isFollow ? COLORS.redalert : COLORS.gray310
  }),
  textStyling: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(18),
    color: COLORS.almostBlack
  }
});

export default React.memo(BottomSheetFollow);
