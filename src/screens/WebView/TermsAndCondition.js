import * as React from 'react';
import {ActivityIndicator, StyleSheet, View, SafeAreaView} from 'react-native';

import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/core';
import analytics from '@react-native-firebase/analytics';
import useIsReady from '../../hooks/useIsReady';
import Header from '../../components/Header';
const TermsAndCondition = () => {
  const isReady = useIsReady()
  const navigator = useNavigation();
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'TermsAndCondition',
      screen_name: 'TermsAndCondition',
    });
  }, []);

  if(!isReady) return null

  return (
    <View style={styles.container}>
      <SafeAreaView>
      <Header title="Terms & Condition" onPress={() => navigator.goBack()} />

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

export default React.memo (TermsAndCondition);

const styles = StyleSheet.create({
  container: {
    paddingTop: 21,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {flex: 1, position: 'relative'},
});
