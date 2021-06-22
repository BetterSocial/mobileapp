import * as React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {WebView} from 'react-native-webview';
import analytics from '@react-native-firebase/analytics';
import {useNavigation} from '@react-navigation/core';

import Header from '../../components/Header';

const PrivacyPolicies = () => {
  const navigator = useNavigation();
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'PrivacyPolicies',
      screen_name: 'PrivacyPolicies',
    });
  }, []);
  return (
    <View style={styles.container}>
      <Header title="Privacy Policies" onPress={() => navigator.goBack()} />
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

export default PrivacyPolicies;

const styles = StyleSheet.create({
  container: {
    paddingTop: 21,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {flex: 1, position: 'relative'},
});
