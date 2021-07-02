import * as React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import Card from '../../components/Card/Card';
import {smartRender} from '../../utils/Utils';

const ContentLink = ({og, onPress, onCardPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.contentFeed}>
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
        onCardPress,
      })}
    </TouchableOpacity>
  );
};

export default ContentLink;

const styles = StyleSheet.create({
  contentFeed: {
    flex: 1,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
