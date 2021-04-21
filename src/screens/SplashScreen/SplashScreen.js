import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import {useNavigation} from '@react-navigation/core';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {Alert, Image, Linking, StyleSheet, View} from 'react-native';
import {getUserId, removeLocalStorege} from '../../data/local/accessToken';
import { getProfileByUsername } from '../../service/profile';
import {verifyUser} from '../../service/users';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const SplashScreen = () => {
  const navigation = useNavigation();
  const BASE_DEEPLINK_URL_REGEX = "link\.bettersocial\.org"
  let [isModalShown, setIsModalShown] = useState(false)
  
  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'SplashScreen',
      screen_name: 'Splash Screen',
    });

    // if(getDynamicLink()) return
    getDeepLinkUrl()
  }, []);

  const init = async () => {
    try {
      let data = await fetchRemoteConfig();
    } catch (error) {
      console.log(error);
    }
  };

  let getDynamicLink = async() => {
    try {
      dynamicLinks().getInitialLink().then((link) => {
        console.log("get initial dynamic link ")
        console.log(link)
        return true
      })

      dynamicLinks().onLink((link) => {
        console.log("dynamic link " + link)
        return true
      })
    } catch(e) {
      console.log("error " + e)
      return false
    }
  }

  let getDeepLinkUrl = async() => {
    try {
      let selfUserId = await doVerifyUser()
      let deepLinkUrl = await Linking.getInitialURL()
      if(deepLinkUrl === null) return navigateWithoutDeeplink(selfUserId)

      let match = deepLinkUrl.match(`(?<=${BASE_DEEPLINK_URL_REGEX}\/).+`)
      if(match.length > 0) {
        setIsModalShown(true)
        let username = match[0]
        let otherProfile = await doGetProfileByUsername(username)

        if(!selfUserId || !otherProfile){
          if(!otherProfile) Alert.alert(`${username}'s Profile not found`)
          return navigateWithoutDeeplink(selfUserId)
        } 
        
        // Check if myself 
        if(selfUserId === otherProfile.user_id) {
          navigation.replace("HomeTabs", {
            screen : 'Profile'
          })
          return setIsModalShown(false)
        }

        navigation.replace("OtherProfile", {
          data : {
            user_id :selfUserId ,
            other_id: otherProfile.user_id,
            username : otherProfile.username
          }
        })

        return setIsModalShown(false)
      }
    } catch(e) {
      return navigateWithoutDeeplink(null)
    }
  }

  let navigateWithoutDeeplink = (selfUserId) => {
    navigation.replace(selfUserId ? 'HomeTabs' : 'SignIn')
  }

  let doVerifyUser = async() => {
    try {
      let humanUserId = await getUserId()
      console.log(`humanUserId ${humanUserId}`)
      let response = await verifyUser(humanUserId)
      if(response.code === 200){
        AsyncStorage.setItem('tkn-getstream', response.token)
        return await (jwtDecode(response.token)).user_id
      } 
      return null
    } catch(e) {
      console.log(e)
      return null
    }
  }

  let doGetProfileByUsername = async(username) => {
    try {
      let response = await getProfileByUsername(username)
      if(response.code === 200) return response.data
      return false
    } catch(e) {
      console.log("get profile by username")
      console.log(e)
      return false
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/ping-icon.png')} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
