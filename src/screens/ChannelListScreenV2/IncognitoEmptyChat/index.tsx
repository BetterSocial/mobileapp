import * as React from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import EmptyIncognito from '../../../assets/images/empty_incognito.png';
import IconArrowRight from '../../../assets/icons/Ic_arrow_right';
import dimen from '../../../utils/dimen';
import {COLORS} from '../../../utils/theme';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {ANONYMOUS} from '../../../hooks/core/constant';
import useAnonymousChannelListScreenHook from '../../../hooks/screen/useAnonymousChannelListHook';
import {DISCOVERY_TAB_TOPICS, NavigationConstants} from '../../../utils/constants';
import StorageUtils from '../../../utils/storage';

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
        <IconArrowRight width={8} height={12} fill={COLORS.gray400} />
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
        {getMode() === MODE_FULL && <View testID="IncognitoEmptyChatLine" style={styles.line} />}
        <IncognitoButton
          title="Start an Incognito Chat"
          subtitle="Send an incognito message to friends."
          onPress={() => goToContactScreen({from: ANONYMOUS})}
        />
        <IncognitoButton
          title="Create an Incognito Post"
          subtitle="Send an incognito message to friends."
          onPress={() =>
            navigation.navigate(NavigationConstants.CREATE_POST_SCREEN, {followType: 'incognito'})
          }
        />
        <IncognitoButton
          title="Join Communities in Incognito Mode"
          subtitle="Safely join without anyone knowing."
          onPress={() => navigation.navigate('DiscoveryScreen', {tab: DISCOVERY_TAB_TOPICS})}
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
    color: COLORS.anon_primary,
    paddingHorizontal: dimen.normalizeDimen(40),
    textAlign: 'center',
    marginTop: dimen.normalizeDimen(16)
  },
  wrapper: {
    paddingHorizontal: dimen.normalizeDimen(20),
    width: '100%'
  },
  line: {
    height: 2,
    backgroundColor: COLORS.gray200,
    marginBottom: dimen.normalizeDimen(24)
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: dimen.normalizeDimen(16),
    paddingVertical: dimen.normalizeDimen(15),
    borderRadius: 8,
    borderColor: COLORS.gray200,
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
    color: COLORS.anon_primary,
    marginBottom: dimen.normalizeDimen(4)
  },
  itemSubtitle: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(18),
    color: COLORS.gray500
  }
});

export default IncognitoEmptyChat;
