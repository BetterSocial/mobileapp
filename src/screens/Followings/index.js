import * as React from 'react';

import {ScrollView, StyleSheet} from 'react-native';
import UsersFragment from '../DiscoveryScreenV2/fragment/UsersFragment';
import {colors} from '../../utils/colors';

const Followings = ({dataFollower = [], isLoading, setDataFollower = () => {}}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      <UsersFragment
        followedUsers={dataFollower}
        setFollowedUsers={setDataFollower}
        isLoadingDiscoveryUser={isLoading}
        showRecentSearch={true}
        withoutRecent={true}
      />
    </ScrollView>
  );
};
export default Followings;

const styles = StyleSheet.create({
  container: {height: '100%', backgroundColor: colors.white}
});
