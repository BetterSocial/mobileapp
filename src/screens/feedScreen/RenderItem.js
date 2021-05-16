import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Share,
  TouchableNativeFeedback,
} from 'react-native';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';

import dynamicLinks from '@react-native-firebase/dynamic-links';

import analytics from '@react-native-firebase/analytics';

import {Card} from '../../components/CardStack';
import {POST_VERB_POLL} from '../../utils/constants';
import ContentPoll from './ContentPoll';

const {width, height} = Dimensions.get('window');

async function buildLink(username) {
  const link = await dynamicLinks().buildLink(
    {
      link: `https://dev.bettersocial.org/${username}`,
      domainUriPrefix: 'https://bettersocialapp.page.link',
      analytics: {
        campaign: 'banner',
      },
      navigation: {
        forcedRedirectEnabled: false,
      },
      // ios: {
      //   bundleId: '',
      //   // customScheme: 'giftit',
      //   appStoreId: '',
      // },
      android: {
        packageName: 'org.bettersocial.dev',
      },
    },
    'SHORT',
  );
  return link;
}

const onShare = async (username) => {
  analytics().logEvent('feed_screen_btn_share', {
    id: 'btn_share',
  });
  try {
    const result = await Share.share({
      message: await buildLink(username),
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

const RenderItem = ({item, onPress, onPressBlock, onPressComment}) => {
  return (
    <Card style={[styles.container]} key={item.id}>
      <Header props={item} />
      {item.verb === POST_VERB_POLL ? (
        <ContentPoll
          message={item.message}
          images_url={item.images_url}
          polls={item.pollOptions}
        />
      ) : (
        <Content
          message={item.message}
          images_url={item.images_url}
          onPress={onPress}
        />
      )}
      <Footer
        item={item}
        onPressShare={() => {
          onShare(item.actor.data.username);
        }}
        onPressBlock={onPressBlock}
        onPressComment={onPressComment}
      />
    </Card>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height - height * 0.15,
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
});
