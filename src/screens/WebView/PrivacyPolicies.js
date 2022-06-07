import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/core';

import Header from '../../components/Header';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

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
      <SafeAreaView>
      <Header title="Privacy Policies" onPress={() => navigator.goBack()}  />
      </SafeAreaView>
      <WebView
        androidHardwareAccelerationDisabled={false}
        source={{ uri: 'https://bettersocial.org/privacy' }}
        showsVerticalScrollIndicator={false}
        startInLoadingState={true}
        style={styles.webview}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#00ADB5" />
          </View>
        )}
      />
    </View>
  );
};

export default withInteractionsManaged(React.memo(PrivacyPolicies));

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: { padding: 0, paddingHorizontal: 16, paddingBottom: 8 },
  loading: { flex: 1, position: 'relative' },
  // webview: {marginHorizontal: -20}
});
