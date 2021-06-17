import * as React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/core';
import analytics from '@react-native-firebase/analytics';

import Header from '../../components/Header';
const TermsAndCondition = () => {
  const navigator = useNavigation();
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'TermsAndCondition',
      screen_name: 'TermsAndCondition',
    });
  }, []);
  return (
    <View style={styles.container}>
      <Header title="Terms & Condition" onPress={() => navigator.goBack()} />
      <WebView
        source={{uri: 'https://www.lipsum.com/feed/html'}}
        showsVerticalScrollIndicator={false}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{flex: 1, position: 'relative'}}>
            <ActivityIndicator size="large" color="#00ADB5" />
          </View>
        )}
      />
    </View>
  );
};

export default TermsAndCondition;

const styles = StyleSheet.create({
  container: {
    paddingTop: 21,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
});
