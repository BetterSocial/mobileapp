import * as React from 'react';
import {StyleSheet, Text} from 'react-native';

import jwtDecode from 'jwt-decode';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ChannelListScreen,
  FeedScreen,
  NewsScreen,
  ProfileScreen,
} from '../screens';
import {colors} from '../utils/colors';
import MemoHome from '../assets/icon/Home';
import MemoFeed from '../assets/icon/Feed';
import MemoNews from '../assets/icon/News';
import {getAccessToken} from '../utils/token';
import {getMyProfile} from '../service/profile';
import MemoProfileIcon from '../assets/icon/Profile';
import {Context} from '../context';
import {setImageUrl} from '../context/actions/users';
import {setMyProfileAction} from '../context/actions/setMyProfileAction';

const Tab = createBottomTabNavigator();

function HomeBottomTabs() {
  // let [profilePic, setProfilePic] = React.useState(null);
  let [users, dispatch] = React.useContext(Context).users;
  console.log(users.photoUrl);
  const [myProfile, setMyProfileDispatch] = React.useContext(Context).myProfile;

  React.useEffect(() => {
    let getProfile = async () => {
      try {
        let token = await getAccessToken();
        let selfUserId = await jwtDecode(token).user_id;
        let profile = await getMyProfile(selfUserId);
        setMyProfileAction(profile.data, setMyProfileDispatch);
        // setProfilePic(profile.data.profile_pic_path);
        console.log('profile.data.profile_pic_path');
        console.log(profile.data.profile_pic_path);
        setImageUrl(profile.data.profile_pic_path, dispatch);
      } catch (e) {
        console.log(e);
      }
    };

    getProfile();
  }, []);

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: true,
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
  );
}

export default HomeBottomTabs;
const styles = StyleSheet.create({
  label: {
    fontSize: 6,
    color: colors.holytosca,
    marginTop: -12,
    marginBottom: 5,
    alignSelf: 'center',
  },
});
