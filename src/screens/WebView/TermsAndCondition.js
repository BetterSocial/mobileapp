import * as React from 'react';
import {ActivityIndicator, StyleSheet, View, SafeAreaView} from 'react-native';

import {WebView} from 'react-native-webview';
import Header from '../../components/Header';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
import {COLORS} from '../../utils/theme';

const TermsAndCondition = ({navigation}) => (
    <View style={styles.container}>
      <SafeAreaView>
      <Header title="Terms & Condition" onPress={() => navigation.goBack()} />

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

export default withInteractionsManaged(TermsAndCondition);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {flex: 1, position: 'relative'},
});
