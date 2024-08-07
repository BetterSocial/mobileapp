import * as React from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import EmptyIncognito from '../../../assets/images/empty_incognito.png';
import IconArrowRight from '../../../assets/icons/Ic_arrow_right';
import StorageUtils from '../../../utils/storage';
import dimen from '../../../utils/dimen';
import useAnonymousChannelListScreenHook from '../../../hooks/screen/useAnonymousChannelListHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../../libraries/analytics/analyticsEventTracking';
import {ANONYMOUS} from '../../../hooks/core/constant';
import {COLORS} from '../../../utils/theme';
import {DISCOVERY_TAB_TOPICS, NavigationConstants} from '../../../utils/constants';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

const {width: widthScreen} = Dimensions.get('window');

const MODE_FULL = 1;
const MODE_BUTTON = 2;
const MODE_HIDE = 3;

const IncognitoButton = ({title, subtitle, onPress}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>
      <View>
        <IconArrowRight width={8} height={12} fill={COLORS.gray410} />
      </View>
    </TouchableOpacity>
  );
};

const IncognitoEmptyChat = () => {
  const {channels: anonChannels, goToContactScreen} = useAnonymousChannelListScreenHook();
  const navigation = useNavigation();
  const totalChannel = StorageUtils.totalAnonChannels.get()
    ? parseInt(StorageUtils.totalAnonChannels.get() || '0', 10)
    : anonChannels.length;

  const getMode = () => {
    let result = MODE_FULL;
    if (totalChannel === 0) {
      result = MODE_FULL;
    }
    if (totalChannel >= 3) {
      result = MODE_HIDE;
    }
    if ((totalChannel > 0 && totalChannel < 3) || widthScreen < 380) {
      result = MODE_BUTTON;
    }

    return result;
  };

  if (getMode() === MODE_HIDE) return null;

  return (
    <View style={styles.container} testID="IncognitoEmptyChatContainer">
      {getMode() === MODE_FULL && (
        <Image testID="IncognitoEmptyChatImage" source={EmptyIncognito} style={styles.image} />
      )}
      {getMode() === MODE_FULL && (
        <Text testID="IncognitoEmptyChatText" style={styles.titleText}>
          All your incognito activity, including chats, posts, comments and communities will appear
          here.
        </Text>
      )}
      <View style={styles.wrapper}>
        <IncognitoButton
          title="Start an Incognito Chat"
          subtitle="Send an incognito message to friends."
          onPress={() => {
            AnalyticsEventTracking.eventTrack(
              BetterSocialEventTracking.ANONYMOUS_CHAT_TAB_EMPTY_CHAT_OPEN_NEW_CHAT
            );
            goToContactScreen({from: ANONYMOUS});
          }}
        />
        <IncognitoButton
          title="Create an Incognito Post"
          subtitle="Send an incognito message to friends."
          onPress={() => {
            AnalyticsEventTracking.eventTrack(
              BetterSocialEventTracking.ANONYMOUS_CHAT_TAB_EMPTY_CHAT_OPEN_CREATE_POST
            );
            navigation.navigate(NavigationConstants.CREATE_POST_SCREEN, {followType: 'incognito'});
          }}
        />
        <IncognitoButton
          title="Join Communities in Incognito Mode"
          subtitle="Safely join without anyone knowing."
          onPress={() => {
            AnalyticsEventTracking.eventTrack(
              BetterSocialEventTracking.ANONYMOUS_CHAT_TAB_EMPTY_CHAT_OPEN_DISCOVERY
            );
            navigation.navigate('DiscoveryScreen', {tab: DISCOVERY_TAB_TOPICS});
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingTop: dimen.normalizeDimen(140),
    paddingBottom: dimen.normalizeDimen(40),
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10
  },
  image: {
    width: widthScreen - 90,
    height: 160,
    resizeMode: 'contain'
  },
  titleText: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(16),
    lineHeight: normalizeFontSize(24),
    color: COLORS.white,
    paddingHorizontal: dimen.normalizeDimen(40),
    textAlign: 'center',
    marginTop: dimen.normalizeDimen(8)
  },
  wrapper: {
    marginTop: dimen.normalizeDimen(24),
    paddingHorizontal: dimen.normalizeDimen(20),
    width: '100%'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray110,
    paddingHorizontal: dimen.normalizeDimen(16),
    paddingVertical: dimen.normalizeDimen(15),
    borderRadius: 8,
    borderColor: COLORS.gray210,
    borderWidth: 1,
    marginBottom: dimen.normalizeDimen(8)
  },
  itemContent: {
    flex: 1
  },
  itemTitle: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(18),
    color: COLORS.white,
    marginBottom: dimen.normalizeDimen(4)
  },
  itemSubtitle: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(18),
    color: COLORS.gray510
  }
});

export default IncognitoEmptyChat;
