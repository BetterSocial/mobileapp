import * as React from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import Header from '../../components/Header';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {COLORS} from '../../utils/theme';

const PrivacyPolicies = ({navigation}) => (
  <View style={styles.container}>
    <SafeAreaView>
      <Header title="Privacy Policies" onPress={() => navigation.goBack()} />
    </SafeAreaView>
    <WebView
      androidHardwareAccelerationDisabled={false}
      source={{uri: 'https://bettersocial.org/privacy'}}
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

export default withInteractionsManaged(React.memo(PrivacyPolicies));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  header: {padding: 0, paddingHorizontal: 16, paddingBottom: 8},
  loading: {flex: 1, position: 'relative'}
});
