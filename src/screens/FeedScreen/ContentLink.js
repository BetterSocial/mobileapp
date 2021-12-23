import {useRoute} from '@react-navigation/native';
import * as React from 'react';
import {Pressable, StyleSheet, TouchableOpacity} from 'react-native';

import {COLORS, SIZES} from '../../utils/theme';
import {smartRender} from '../../utils/Utils';
import Card from '../../components/Card/Card';

const ContentLink = ({og, onPress, onHeaderPress, onCardContentPress}) => {
  let route = useRoute();
  let isTouchableDisabled = route?.name === 'PostDetailPage';
  return (
    <Pressable
      disabled={isTouchableDisabled}
      onPress={onPress}
      style={styles.contentFeed}>
      {smartRender(Card, {
        domain: og.domain,
        date: new Date(og.date).toLocaleDateString(),
        domainImage:
          og.domainImage !== ''
            ? og.domainImage
            : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
        title: og.title,
        description: og.description,
        image: og.image,
        url: og.url,
        onHeaderPress,
        onCardContentPress,
      })}
    </Pressable>
  );
};

export default ContentLink;

const styles = StyleSheet.create({
  contentFeed: {
    flex: 1,
    marginTop: SIZES.base,
    marginHorizontal: 6,
    backgroundColor: COLORS.white,
    maxHeight: 460,
  },
});
