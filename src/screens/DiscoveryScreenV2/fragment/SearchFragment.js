import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import RecentSearch from '../elements/RecentSearch';
import {COLORS} from '../../../utils/theme';

const SearchFragment = () => (
  <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
    <RecentSearch />
    <DiscoveryTitleSeparator text="Suggested Users" />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  }
});

export default SearchFragment;
