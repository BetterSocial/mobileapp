import React, {forwardRef, Ref} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import IconClose from '../../../assets/icon/IconClose';
import {BottomSheetV2} from '../../../components/BottomSheet';
import dimen from '../../../utils/dimen';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import {Button} from '../../../components/Button';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';
import UserItem from './UserItem';
import DiscoveryRepo from '../../../service/discovery';
import DiscoveryAction from '../../../context/actions/discoveryAction';
import {Context} from '../../../context';

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
}

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
  const [, discoveryDispatch] = (React.useContext(Context) as any)?.discovery;
  const {followTopic} = useChatClientHook();

  const handleFollowTopic = async ({type: followTypeParam}: {type: Follow}) => {
    const isIncognito = followTypeParam === 'incognito';

    const followTypeCheck = (targetType: Follow) => followType === targetType || followType === '';

    const follow = async (type: Follow) => {
      setFollowType(type);
      setIsFollow(true);
      try {
        await followTopic(topicName, isIncognito);
        getTopicDetail(topicName);
        const discoveryInitialTopicResponse = await DiscoveryRepo.fetchInitialDiscoveryTopics();
        DiscoveryAction.setDiscoveryInitialTopics(
          discoveryInitialTopicResponse.suggestedTopics as any,
          discoveryDispatch
        );
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
