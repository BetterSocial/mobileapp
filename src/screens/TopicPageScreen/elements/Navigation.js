import {useNavigation} from '@react-navigation/core';
import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import dimen from '../../../utils/dimen';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {convertString} from '../../../utils/string/StringUtils';
import ButtonFollow from './ButtonFollow';
import ButtonFollowing from './ButtonFollowing';
import ShareIcon from '../../../assets/icons/Ic_share';
import Search from '../../FeedScreen/elements/Search';

const Navigation = ({domain, onPress, isFollow = false, onShareCommunity}) => {
  const navigation = useNavigation();

  const backScreen = () => {
    navigation.goBack();
  };

  return (
    <Search>
      <TouchableOpacity onPress={() => backScreen()} style={styles.backbutton}>
        <MemoIc_arrow_back width={normalize(18)} height={normalize(18)} />
      </TouchableOpacity>
      <View style={styles.domain}>
        <Text style={styles.domainText} numberOfLines={1} ellipsizeMode="tail">
          {`#${convertString(domain, ' ', '')}`}
        </Text>
      </View>
      <View style={styles.containerAction}>
        <TouchableOpacity onPress={onShareCommunity} style={styles.shareIconStyle}>
          <ShareIcon color="black" width={20} height={20} />
        </TouchableOpacity>
        {isFollow ? (
          <ButtonFollowing handleSetUnFollow={onPress} />
        ) : (
          <ButtonFollow handleSetFollow={onPress} />
        )}
      </View>
    </Search>
  );
};

const styles = StyleSheet.create({
  Header: {
    flexDirection: 'row',
    height: dimen.size.TOPIC_FEED_HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  backbutton: {
    paddingRight: 16,
    height: '100%',
    justifyContent: 'center'
  },
  domain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 14,
    alignSelf: 'center'
  },
  domainText: {
    fontSize: normalizeFontSize(18),
    fontFamily: fonts.inter[600],
    lineHeight: normalize(19),
    fontWeight: 'bold',
    textAlign: 'left'
  },
  buttonFollow: {
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  containerAction: {
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareIconStyle: {
    padding: 10
  }
});

export default Navigation;
