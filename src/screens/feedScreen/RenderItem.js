import React from 'react';
import {View, Text, StyleSheet, Dimensions, Share} from 'react-native';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';

import dynamicLinks from '@react-native-firebase/dynamic-links';

import analytics from '@react-native-firebase/analytics';

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

const RenderItem = ({item}) => {
  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get('screen').height - 100,
        marginBottom: 16,
        marginTop: 8,
      }}>
      <Header props={item} />
      <Content message={item.message} images_url={item.images_url} />
      <Footer
        onPressShare={() => {
          onShare(item.actor.data.username);
        }}
      />
    </View>
  );
};

export default RenderItem;
