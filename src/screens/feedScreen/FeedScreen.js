import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
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
import {getMainFeed} from '../../service/post';
import RenderItem from './RenderItem';
import Loading from '../../components/Loading';
import CardStack, {Card} from 'react-native-card-stack-swiper';

const {width, height} = Dimensions.get('window');

let token_JWT = '';
const FeedScreen = (props) => {
  const [tokenParse, setTokenParse] = useState({});
  const [mainFeeds, setMainFeeds] = useState([]);
  const apiKey = STREAM_API_KEY;
  const appId = STREAM_APP_ID;
  const token = token_JWT;

  const [dataProfile, setDataProfile] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [geoList, setGeoList] = useState([]);

  useEffect(() => {
    const getDataFeeds = async () => {
      setInitialLoading(true);
      try {
        const dataFeeds = await getMainFeed();
        // console.log("pollOptions")
        // console.log(dataFeeds.data.results)
        let data = dataFeeds.data;
        console.log(data);
        setMainFeeds(data);
        setInitialLoading(false);
      } catch (e) {
        console.log(e);
        setInitialLoading(false);
      }
    };
    getDataFeeds();
  }, []);

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
        const decoded = await JWTDecode(value);
        console.log(value);
        setTokenParse(decoded);
      }
    };
    parseToken();
  }, []);

  const fetchMyProfile = async () => {
    setLoading(true);
    let token = await getToken();
    if (token) {
      const decoded = await JWTDecode(token);
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

  if (initialLoading === true) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Loading visible={initialLoading} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
      {mainFeeds !== undefined && (
        <CardStack
          style={{
            flex: 5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
          renderNoMoreCards={() => {
            console.log('no more card');
            // setInit();
            // setLoading(true);
            return (
              <Text style={{fontWeight: '700', fontSize: 18, color: 'gray'}}>
                Load more cards :(
              </Text>
            );
          }}
          ref={(swiper) => {
            this.swiper = swiper;
          }}
          disableLeftSwipe={true}
          disableRightSwipe={true}
          verticalSwipe={true}
          verticalThreshold={1}
          horizontalSwipe={false}
          onSwipedBottom={() => {
            this.swiper.goBackFromTop();
            this.swiper.goBackFromTop();
          }}
          onSwipedTop={() => {
            console.log('onSwiped Top');
          }}>
          {mainFeeds !== undefined
            ? mainFeeds.map((item) => (
                <RenderItem key={Math.random() * 1000} item={item} />
              ))
            : null}
        </CardStack>
      )}

      <Loading visible={loading} />

      <ButtonNewPost />
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
});
