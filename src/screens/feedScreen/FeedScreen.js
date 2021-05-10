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
const data = [
  {
    actor: {
      created_at: '2021-04-22T05:00:34.906913Z',
      updated_at: '2021-04-22T05:00:34.906913Z',
      id: 'd4ec3968-80a0-477b-8b16-5c8010bc520f',
      data: {
        created_at: '2021-04-21T22:00:31.000Z',
        human_id: 'P19FGPQGMSZ5VSHA0YSQ',
        profile_pic_url:
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
        username: 'usupsuparma',
      },
    },
    anonimity: false,
    count_downvote: 0,
    count_upvote: 0,
    duration_feed: '30',
    expired_at: '2021-06-08T23:18:44.000Z',
    foreign_id: 'd4ec3968-80a0-477b-8b16-5c8010bc520f1620602324157',
    id: 'e6df78da-b11c-11eb-87ec-0a1200300037',
    images_url: [
      'http://res.cloudinary.com/hpjivutj2/image/upload/v1620602323/uahyt5hydwo1mixfaiju.jpg',
    ],
    location: 'Brooklyn',
    message:
      'Any person capable of angering you becomes you master. They can anger you only when you permit yourself to be disturbed by them',
    object:
      '{"feed_group":"main_feed","message":"Any person capable of angering you becomes you master. They can anger you only when you permit yourself to be disturbed by them","profile_pic_path":"https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png","real_name":null,"topics":["korek"],"username":"usupsuparma","verb":"tweet"}',
    origin: 'location:brooklyn',
    post_type: 0,
    privacy: 'Public',
    target: '',
    time: '2021-05-09T23:18:45.553788',
    to: [
      'user:d4ec3968-80a0-477b-8b16-5c8010bc520f',
      'topic:korek',
      'location:brooklyn',
      'location:everywhare',
    ],
    topics: ['korek'],
    verb: 'tweet',
  },
  {
    actor: {
      created_at: '2021-04-22T05:00:34.906913Z',
      updated_at: '2021-04-22T05:00:34.906913Z',
      id: 'd4ec3968-80a0-477b-8b16-5c8010bc520f',
      data: {
        created_at: '2021-04-21T22:00:31.000Z',
        human_id: 'P19FGPQGMSZ5VSHA0YSQ',
        profile_pic_url:
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
        username: 'usupsuparma',
      },
    },
    anonimity: false,
    count_downvote: 0,
    count_upvote: 0,
    duration_feed: 30,
    expired_at: '2021-05-31T13:12:23.000Z',
    foreign_id: 'd4ec3968-80a0-477b-8b16-5c8010bc520f1619874743814',
    id: 'dfd83127-aa7e-11eb-be00-0ae838defca7',
    images_url: [],
    location: 'Brooklyn',
    message:
      'Do you little bit of good where you are, it is those little bits of good put together that overwhelm the world',
    object:
      '{"feed_group":"main_feed","message":"Do you little bit of good where you are, it is those little bits of good put together that overwhelm the world","profile_pic_path":"https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png","real_name":null,"topics":["maja"],"username":"usupsuparma","verb":"tweet"}',
    origin: 'location:brooklyn',
    post_type: 0,
    privacy: 'Public',
    target: '',
    time: '2021-05-01T13:12:26.302084',
    to: [
      'user:d4ec3968-80a0-477b-8b16-5c8010bc520f',
      'topic:maja',
      'location:brooklyn',
      'location:everywhare',
    ],
    topics: ['maja'],
    verb: 'tweet',
  },
  {
    actor: {
      created_at: '2021-04-22T05:00:34.906913Z',
      updated_at: '2021-04-22T05:00:34.906913Z',
      id: 'd4ec3968-80a0-477b-8b16-5c8010bc520f',
      data: {
        created_at: '2021-04-21T22:00:31.000Z',
        human_id: 'P19FGPQGMSZ5VSHA0YSQ',
        profile_pic_url:
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
        username: 'usupsuparma',
      },
    },
    anonimity: false,
    count_downvote: 0,
    count_upvote: 0,
    duration_feed: '30',
    expired_at: '2021-05-30T07:19:01.000Z',
    foreign_id: 'd4ec3968-80a0-477b-8b16-5c8010bc520f1619767141324',
    id: '57af5143-a984-11eb-91ba-0ae838defca7',
    images_url: [],
    location: 'Everywhere',
    message: 'Hari ini panas sekali',
    object:
      '{"feed_group":"main_feed","message":"Hari ini panas sekali","profile_pic_path":"https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png","real_name":null,"topics":["maja"],"username":"usupsuparma","verb":"tweet"}',
    origin: 'location:everywhere',
    post_type: 0,
    privacy: 'Public',
    target: '',
    time: '2021-04-30T07:19:03.681671',
    to: [
      'user:d4ec3968-80a0-477b-8b16-5c8010bc520f',
      'topic:maja',
      'location:everywhere',
      'location:everywhare',
    ],
    topics: ['maja'],
    verb: 'tweet',
  },
  {
    actor: {
      created_at: '2021-04-05T11:27:00.444349Z',
      updated_at: '2021-04-05T11:27:00.444349Z',
      id: 'af142ddc-cdb5-4e40-af75-f88c0b4136b8',
      data: {
        name: 'Unknown',
      },
    },
    anonimity: true,
    count_downvote: 0,
    count_upvote: 0,
    duration_feed: 999,
    expired_at: '2024-01-18T02:44:40.000Z',
    foreign_id: 'af142ddc-cdb5-4e40-af75-f88c0b4136b81619232280046',
    id: '04230b50-a4a7-11eb-9e06-0a0d7a10423a',
    images_url: [],
    location: 'Everywhere',
    message: 'Selamat pagi jaksel, apakah kau masih baik baik aja?',
    object:
      '{"feed_group":"main_feed","message":"Selamat pagi jaksel, apakah kau masih baik baik aja?","profile_pic_path":null,"real_name":"busan","topics":["jaksel"],"username":"budi","verb":"tweet"}',
    origin: 'location:everywhere',
    post_type: 0,
    privacy: 'Public',
    target: '',
    time: '2021-04-24T02:44:40.083131',
    topics: ['jaksel'],
    verb: 'tweet',
  },
];
const FeedScreen = (props) => {
  const [tokenParse, setTokenParse] = useState({});
  const [mainFeeds, setMainFeeds] = useState(data);
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
      const dataFeeds = await getMainFeed();
      // console.log("pollOptions")
      // console.log(dataFeeds.data.results)
      let data = dataFeeds.data.results;
      setMainFeeds(data);
      setInitialLoading(false);
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
      {/* <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 16}}> */}
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
        {/* {token !== '' && (
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
        )} */}
        {/* <FlatList
            style={{flex: 1, height: '100%'}}
            data={mainFeeds}
            renderItem={({item, index}) => <RenderItem item={item} />}
            keyExtractor={(item) => item.id}
            pagingEnabled={true}
          /> */}
        {mainFeeds.length > 0
          ? mainFeeds.map((item) => <RenderItem key={Math.random() * 1000} item={item} />)
          : null}
        {/* {mainFeeds !== null
          ? mainFeeds.map((item, index) => {
              console.log(index);
              return renderItem(item);
            })
          : null} */}
      </CardStack>
      {/* </View> */}

      <Loading visible={loading} />

      {/* <ButtonNewPost /> */}
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
});
