import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {ButtonNewPost} from '../../components/Button';
import {STREAM_API_KEY, STREAM_APP_ID} from '@env';
import {
  StreamApp,
  FlatFeed,
  Activity,
  StatusUpdateForm,
  LikeButton,
} from 'react-native-activity-feed';
import {getToken} from '../../helpers/getToken';
import JWTDecode from 'jwt-decode';

import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderActivity from './RenderActivity';
import {getMyProfile} from '../../service/profile';

let token_JWT = '';

const FeedScreen = (props) => {
  const [tokenParse, setTokenParse] = useState({});
  const [dataMain, setDataMain] = useState({});
  const apiKey = STREAM_API_KEY;
  const appId = STREAM_APP_ID;
  const token = token_JWT;

  getToken().then((val) => {
    token_JWT = val;
  });

  useEffect(() => {
    const parseToken = async () => {
      const value = await AsyncStorage.getItem('tkn-getstream');
      if (value) {
        var decoded = await JWTDecode(value);
        setTokenParse(decoded);
      }
    };
    parseToken();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
      <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 16}}>
        {token !== '' && (
          <StreamApp apiKey={apiKey} appId={appId} token={token}>
            <FlatFeed
              feedGroup="main_feed"
              userId={tokenParse.user_id}
              Activity={(props, index) => {
                return RenderActivity(props);
              }}
              notify
            />
          </StreamApp>
        )}
      </View>

      <ButtonNewPost />
    </SafeAreaView>
  );
};

export default FeedScreen;
