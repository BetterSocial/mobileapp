import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Button, Linking, StyleSheet, Text, View} from 'react-native';
import {Context} from '../../context';
import {
  setDataHumenId,
  setImage,
  setUsername,
} from '../../context/actions/users';
import { getMyProfile, getProfileByUsername } from '../../service/profile';
import Modal from 'react-native-modal' 
import { colors } from '../../utils/colors';
import { getToken, getUserId, getUserName } from '../../data/local/accessToken';
import jwtDecode from 'jwt-decode';
import { verifyUser } from '../../service/users';
import AsyncStorage from '@react-native-community/async-storage';

const Home = ({ navigation }) => {
  let [isModalShown, setIsModalShown] = useState(false)
  const [state, dispatch] = useContext(Context).users;
  const BASE_DEEPLINK_URL_REGEX = "link\.bettersocial\.org"
  
  useEffect(() => {
    let getDeepLinkUrl = async() => {
      let deepLinkUrl = await Linking.getInitialURL()
      console.log(`deeplink Url ${deepLinkUrl}`)

      if(deepLinkUrl === null) return

      let match = deepLinkUrl.match(`(?<=${BASE_DEEPLINK_URL_REGEX}\/).+`)
      if(match.length > 0) {
        setIsModalShown(true)
        let username = match[0]
        let token = await doVerifyUser()
        let otherProfile = await doGetProfileByUsername(username)

        console.log(otherProfile.user_id)

        let selfUserId = null
        if(token) {
          selfUserId = (await jwtDecode(token)).user_id
        }

        if(!selfUserId || !otherProfile) return setIsModalShown(false)
        
        // Check if myself 
        if(selfUserId === otherProfile.user_id) {
          navigation.push("HomeTabs", {
            screen : 'Profile'
          })
          return setIsModalShown(false)
        }

        navigation.push("OtherProfile", {
          data : {
            user_id :selfUserId ,
            other_id: otherProfile.user_id,
            username : otherProfile.username
          }
        })

        return setIsModalShown(false)
      }
    }

    getDeepLinkUrl()
  }, [])

  let doVerifyUser = async() => {
    try {
      let humanUserId = await getUserId()
      let response = await verifyUser(humanUserId)
      if(response.code === 200){
        AsyncStorage.setItem('tkn-getstream', response.token)
        return response.token
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
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Modal isVisible={isModalShown}>
        <View style={S.modalbackdrop}>
          <ActivityIndicator color={colors.blue}/>
          <Text style={S.indicatortext}>Getting Profile...</Text>
        </View>
      </Modal>
      <Text>ini screen hanya untuk testing</Text>
      {/* <Button title="hman" onPress={() => setImage('hasilimage', dispatch)} />
      <Button
        title="username"
        onPress={() => setUsername('username', dispatch)}
      />
      <Button
        title="image"
        onPress={() =>
          setDataHumenId(
            {
              appUserId: 'idhu',
              countryCode: 'ID',
            },
            dispatch,
          )
        }
      />
      <Button title="hasil" onPress={() => console.log(state)} /> */}
    </View>
  );
};

let S = StyleSheet.create({
  modalbackdrop : {
    width : '100%',
    backgroundColor : 'white',
    padding : 24,
    display : 'flex',
    flexDirection : 'row'
  },

  indicatortext : {
    marginLeft : 16
  }
})

export default Home;
