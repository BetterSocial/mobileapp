import * as React from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import EmptyIncognito from '../../../assets/images/empty_incognito.png';
import MemoIc_arrow_right from '../../../assets/icons/Ic_arrow_right';
import dimen from '../../../utils/dimen';
import {COLORS} from '../../../utils/theme';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

const IncognitoEmptyChat = ({totalChannel}) => {
  return totalChannel >= 3 ? null : (
    <View style={styles.container}>
      {totalChannel === 0 && <Image source={EmptyIncognito} style={styles.image} />}
      {totalChannel === 0 && (
        <Text style={styles.titleText}>
          All your incognito activity, including chats, posts, comments and communities will appear
          here.
        </Text>
      )}
      <View style={styles.wrapper}>
        {totalChannel === 0 && <View style={styles.line} />}
        <TouchableOpacity style={styles.item}>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Start an Incognito Chat</Text>
            <Text style={styles.itemSubtitle}>Send an incognito message to friends.</Text>
          </View>
          <View>
            <MemoIc_arrow_right width={8} height={12} fill={COLORS.gray400} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Create an Incognito Post</Text>
            <Text style={styles.itemSubtitle}>Post and comment using an alias.</Text>
          </View>
          <View>
            <MemoIc_arrow_right width={8} height={12} fill={COLORS.gray400} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Join Communities in Incognito Mode</Text>
            <Text style={styles.itemSubtitle}>Safely join without anyone knowing.</Text>
          </View>
          <View>
            <MemoIc_arrow_right width={8} height={12} fill={COLORS.gray400} />
          </View>
        </TouchableOpacity>
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
    paddingBottom: dimen.normalizeDimen(42),
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10
  },
  image: {
    width: 250,
    height: 141,
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
    padding: dimen.normalizeDimen(16),
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
