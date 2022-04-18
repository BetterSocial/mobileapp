import * as React from 'react';
import {ActivityIndicator, StyleSheet, View, SafeAreaView} from 'react-native';

import {WebView} from 'react-native-webview';
import analytics from '@react-native-firebase/analytics';
import {useNavigation} from '@react-navigation/core';
import useIsReady from '../../hooks/useIsReady';
import Header from '../../components/Header';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
const PrivacyPolicies = () => {
  const navigator = useNavigation();
  const isReady = useIsReady()
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'PrivacyPolicies',
      screen_name: 'PrivacyPolicies',
    });
  }, []);

  if(!isReady) return null

  return (
    <View style={styles.container}>
      <SafeAreaView>
      <Header title="Privacy Policies" onPress={() => navigator.goBack()} />
      </SafeAreaView>
      <WebView
        source={{uri: 'https://www.lipsum.com/feed/html'}}
        showsVerticalScrollIndicator={false}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.content}>
            <ActivityIndicator size="large" color="#00ADB5" />
          </View>
        )}
      />
    </View>
  );
};

export default React.memo (PrivacyPolicies);

const styles = StyleSheet.create({
  container: {
    paddingTop: 21,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {flex: 1, position: 'relative'},
});
