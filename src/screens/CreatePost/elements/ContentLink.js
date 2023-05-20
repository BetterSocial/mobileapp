import * as React from 'react';
import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import {useRoute} from '@react-navigation/native';

import Card from '../../../components/Card/CardInLinkPreview';
import {smartRender} from '../../../utils/Utils';

const ContentLink = ({og, onPress, onHeaderPress, onCardContentPress}) => {
  const route = useRoute();
  const isTouchableDisabled = route?.name === 'PostDetailPage';

  return (
    <View style={styles.contentFeed}>
      <TouchableNativeFeedback
        disabled={isTouchableDisabled}
        onPress={onPress}
        testID="contentLinkContentPressable">
        <>
          {smartRender(Card, {
            domain: og.domain,
            date: new Date(og.date).toLocaleDateString(),
            domainImage: og.domainImage,
            title: og.title,
            description: og.description,
            image: og.image,
            url: og.url,
            onHeaderPress,
            onCardContentPress
          })}
        </>
      </TouchableNativeFeedback>
    </View>
  );
};

export default ContentLink;

const styles = StyleSheet.create({
  contentFeed: {
    flex: 1,
    marginTop: 12,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginHorizontal: 6
  }
});
