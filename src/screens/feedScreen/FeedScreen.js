// import React, {useEffect} from 'react';
// import {View, Text} from 'react-native';
// import {ButtonNewPost} from '../../components/Button';
// import analytics from '@react-native-firebase/analytics';

// const FeedScreen = () => {
//   // useEffect(() => {
//   //   analytics().logScreenView({
//   //     screen_class: 'FeedScreen',
//   //     screen_name: 'Feed',
//   //   });
//   // }, []);
//   return (
//     <View style={{flex: 1, flexDirection: 'column'}}>
//       <Text>Feed Screen</Text>
//       <ButtonNewPost />
//     </View>
//   );
// };

// export default FeedScreen;
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ButtonNewPost} from '../../components/Button';
import analytics from '@react-native-firebase/analytics';
const FeedScreen = () => {
  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed',
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text>feed</Text>
      <ButtonNewPost />
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
});
