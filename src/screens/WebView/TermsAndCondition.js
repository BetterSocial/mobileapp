import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import Header from '../../components/Header';
import {WebView} from 'react-native-webview';
import analytics from '@react-native-firebase/analytics';
import {useNavigation} from '@react-navigation/core';
const TermsAndCondition = () => {
  const navigator = useNavigation();
  useEffect(() => {
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
