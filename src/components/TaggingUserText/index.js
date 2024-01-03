import * as React from 'react';
import {StyleSheet, Text} from 'react-native';

import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import {getUserId} from '../../utils/token';

const TaggingUserText = ({
  text,
  navigation = null,
  currentTopic = null,
  otherId = null,
  goToDetailPage,
  item,
  isShortText
}) => {
  const username = text.replace('@', '');

  const onClick = () => {
    // comment sebentar

    if (!navigation || currentTopic === text.replace('@', '')) return;
    if (goToDetailPage && navigation) {
      navigation.push('PostDetailPage', {
        // index: index,
        isalreadypolling: item.isalreadypolling,
        feedId: item.id,
        // refreshParent:  getDataFeedsHandle,
        data: item,
        isCaching: false
      });
      return;
    }

    getUserId().then((selfId) => {
      navigation.push('OtherProfile', {
        data: {
          user_id: selfId,
          other_id: otherId,
          username
        }
      });
    });
  };

  return (
    <Text
      testID="TaggingUserTextComponent"
      onPress={onClick}
      style={[styles.text, styles.shortText(isShortText)]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: COLORS.blue,
    fontFamily: fonts.inter[500]
  },
  shortText: (isShort) => ({
    color: isShort ? COLORS.black50 : COLORS.blue
  })
});

export default React.memo(TaggingUserText);
