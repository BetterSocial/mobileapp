import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
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

import RenderActivity from './RenderActivity';
import {getMyProfile} from '../../service/profile';
import analytics from '@react-native-firebase/analytics';
import {getAccessToken} from '../../data/local/accessToken';

let token_JWT = '';
const FeedScreen = (props) => {
  const [tokenParse, setTokenParse] = useState({});
  const [dataMain, setDataMain] = useState({});
  const apiKey = STREAM_API_KEY;
  const appId = STREAM_APP_ID;
  const token = token_JWT;

  const [dataProfile, setDataProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [geoList, setGeoList] = useState([]);

  getToken().then((val) => {
    token_JWT = val;
  });
  useEffect(() => {
    // fetchMyProfile();
    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed Screen',
    });
  }, []);
  useEffect(() => {
    const parseToken = async () => {
      const value = await getAccessToken();
      if (value) {
        var decoded = await JWTDecode(value);
        setTokenParse(decoded);
      }
    };
    parseToken();
  }, []);

  const fetchMyProfile = async () => {
    setLoading(true);
    let token = await getToken();
    if (token) {
      var decoded = await JWTDecode(token);
      const result = await getMyProfile(decoded.user_id);
      if (result.code === 200) {
        setDataProfile(result.data);
        setLoading(false);
        await result.data.locations.map((res) => {
          location.push({
            location_id: res.location_id,
            neighborhood: res.neighborhood,
          });
        });
        setGeoList(location);

        // setGeoList((val) => [...val, result.data.locations]);
        // (val) => [...val, topic];
        // console.log('isi result ', result.data.locations);
      }
    }
  };
  return (
    <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
      <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 16}}>
        {token !== '' && (
          <StreamApp apiKey={apiKey} appId={appId} token={token}>
            <FlatFeed
              flatListProps={{showsVerticalScrollIndicator: false}}
              feedGroup="main_feed"
              userId={tokenParse.user_id}
              Activity={(props, index) => {
                return <RenderActivity {...props} />;
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

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
});
