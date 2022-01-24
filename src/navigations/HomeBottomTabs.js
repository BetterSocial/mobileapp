import * as React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import FirebaseConfig from '../configs/FirebaseConfig';
import MemoFeed from '../assets/icon/Feed';
import MemoHome from '../assets/icon/Home';
import MemoNews from '../assets/icon/News';
import MemoProfileIcon from '../assets/icon/Profile';
import {
  ChannelListScreen,
  FeedScreen,
  NewsScreen,
  ProfileScreen,
} from '../screens';
import {Context} from '../context';
import {colors} from '../utils/colors';
import {getMyProfile} from '../service/profile';
import {getUserId} from '../utils/users';
import {setImageUrl} from '../context/actions/users';
import {setMyProfileAction} from '../context/actions/setMyProfileAction';

const Tab = createBottomTabNavigator();

function HomeBottomTabs(props) {
  const {navigation} = props
  let [users, dispatch] = React.useContext(Context).users;
  let [, dispatchProfile] = React.useContext(Context).profile;
  const [unReadMessage] = React.useContext(Context).unReadMessage;
  React.useEffect(() => {
    let getProfile = async () => {
      try {
        let selfUserId = await getUserId();
        let profile = await getMyProfile(selfUserId);
        setImageUrl(profile.data.profile_pic_path, dispatch);
        let data = {
          user_id: profile.data.user_id,
          username: profile.data.username,
        };
        setMyProfileAction(data, dispatchProfile);
      } catch (e) {
        console.log(e);
      }
    };

    getProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Tab.Navigator
        initialRouteName="ChannelList"
        // initialRouteName="Profile"
        tabBarOptions={{
          // showLabel: true,
          activeTintColor: colors.holytosca,
          inactiveTintColor: colors.gray1,
        }}
        screenOptions={({route, navigation}) => {
          return {
            activeTintColor: colors.holytosca,
            tabBarLabel: () => (
              <Text style={styles.label}>
                {navigation.isFocused() ? '\u2B24' : ''}
              </Text>
            ),
          };
        }}>
        <Tab.Screen
          name="ChannelList"
          component={ChannelListScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({color}) => <MemoHome fill={color} />,
            tabBarBadge: unReadMessage.total_unread_count
              ? unReadMessage.total_unread_count
              : null,
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({color}) => <MemoFeed fill={color} />,
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({focused, color}) => <MemoNews fill={color} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({focused}) => <MemoProfileIcon uri={users.photoUrl} />,
          }}
        />
      </Tab.Navigator>
      <FirebaseConfig navigation={navigation} />
    </SafeAreaView>
  );
}

export default HomeBottomTabs;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  label: {
    fontSize: 6,
    color: colors.holytosca,
    marginTop: -12,
    marginBottom: 5,
    alignSelf: 'center',
  },
});
