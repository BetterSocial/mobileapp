import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert,
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
import CardStack, {Card} from '../../components/CardStack';
import BlockUser from '../../elements/Blocking/BlockUser';
import BlockDomain from '../../elements/Blocking/BlockDomain';
import ReportUser from '../../elements/Blocking/ReportUser';
import ReportDomain from '../../elements/Blocking/ReportDomain';
import SpecificIssue from '../../elements/Blocking/SpecificIssue';
import Toast from 'react-native-simple-toast';
import {blockUser} from '../../service/blocking';
import {downVote, upVote} from '../../service/vote';

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
  const [countStack, setCountStack] = useState(null);
  const [username, setUsername] = useState('');
  const [reportOption, setReportOption] = useState([]);
  const [messageReport, setMessageReport] = useState('');
  const [userId, setUserId] = useState('');
  const [postId, setPostId] = useState('');

  const refBlockUser = useRef();
  const refBlockDomain = useRef();
  const refReportUser = useRef();
  const refReportDomain = useRef();
  const refSpecificIssue = useRef();

  const onSelectBlocking = (v) => {
    if (v !== 1) {
      // refBlockDomain.current.open();
      refReportUser.current.open();
    } else {
      userBlock();
    }
    refBlockUser.current.close();
  };

  const onNextQuestion = (v) => {
    console.log(v);
    setReportOption(v);
    refReportUser.current.close();
    refSpecificIssue.current.open();
  };

  const userBlock = async () => {
    const data = {
      userId: userId,
      postId: postId,
      source: 'screen_feed',
      reason: reportOption,
      message: messageReport,
    };
    let result = await blockUser(data);
    if (result.code == 200) {
      Toast.show(
        'The user was blocked successfully. \nThanks for making BetterSocial better!',
        Toast.LONG,
      );
    } else {
      Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
    console.log('result block user ', result);
  };

  const onIssue = (v) => {
    refSpecificIssue.current.close();
    setMessageReport(v);
    setTimeout(() => {
      userBlock();
    }, 500);
  };
  const onSkipOnlyBlock = () => {
    refReportUser.current.close();
    userBlock();
  };

  useEffect(() => {
    getDataFeeds();
  }, []);

  const getDataFeeds = async (id = '') => {
    setCountStack(null);
    setInitialLoading(true);
    try {
      let query = '';
      if (id !== '') {
        query = '?id_lt=' + id;
      }
      const dataFeeds = await getMainFeed(query);
      if (dataFeeds.data.length > 0) {
        let data = dataFeeds.data;
        setCountStack(data.length);
        setMainFeeds(data);
      }
      setInitialLoading(false);
    } catch (e) {
      console.log(e);
      setInitialLoading(false);
    }
  };

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
  const setDataToState = (value) => {
    if (value.anonimity === true) {
      setUsername('Anonymous');
      setPostId(value.id);
      setUserId(value.actor.id + '-anonymous');
    } else {
      setUsername(value.actor.data.username);
      setPostId(value.id);
      setUserId(value.actor.id);
    }
  };
  const setUpVote = async (id) => {
    let result = await upVote({activity_id: id});
    if (result.code == 200) {
      Toast.show('up vote was successful', Toast.LONG);
    } else {
      Toast.show('up vote failed', Toast.LONG);
    }
  };
  const setDownVote = async (id) => {
    let result = await downVote({activity_id: id});
    if (result.code == 200) {
      Toast.show('down vote success', Toast.LONG);
    } else {
      Toast.show('down vote failed', Toast.LONG);
    }
  };

  useEffect(() => {
    const parseToken = async () => {
      const value = await getAccessToken();
      console.log(value);
      if (value) {
        const decoded = await JWTDecode(value);
        setTokenParse(decoded);
      }
    };
    parseToken();
  }, []);

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
            // setInit();
            // setLoading(true);
            // console.log(countStack);
            if (countStack === 0) {
              let lastId = mainFeeds[mainFeeds.length - 1].id;
              getDataFeeds(lastId);
            }
            // return (
            //   <Text style={{fontWeight: '700', fontSize: 18, color: 'gray'}}>
            //     Load more cards :(
            //   </Text>
            // );
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
            // this.swiper.goBackFromTop();
            // this.swiper.goBackFromTop();
            setCountStack(countStack + 1);
            // console.log('onSwipeBottom');
          }}
          onSwipedTop={() => {
            setCountStack(countStack - 1);
            // console.log('onSwiped top');
          }}>
          {mainFeeds !== undefined
            ? mainFeeds.map((item) => (
                <RenderItem
                  key={item}
                  item={item}
                  onPressBlock={(value) => {
                    setDataToState(value);
                    refBlockUser.current.open();
                  }}
                  onPressComment={() => {
                    props.navigation.navigate('PostDetailPage', {item: item})
                  }}
                  onPressUpvote={(value) => {
                    setUpVote(value.id);
                  }}
                  onPressDownVote={(value) => {
                    setDownVote(value.id);
                  }}
                />
              ))
            : null}
        </CardStack>
      )}

      <Loading visible={loading} />

      {/* <ButtonNewPost /> */}
      <BlockUser
        refBlockUser={refBlockUser}
        onSelect={(v) => onSelectBlocking(v)}
        username={username}
      />
      <BlockDomain
        refBlockUser={refBlockDomain}
        domain="guardian.com"
        onSelect={() => {}}
      />
      <ReportUser
        refReportUser={refReportUser}
        onSelect={onNextQuestion}
        onSkip={onSkipOnlyBlock}
      />
      <ReportDomain refReportDomain={refReportDomain} />
      <SpecificIssue
        refSpecificIssue={refSpecificIssue}
        onPress={onIssue}
        onSkip={onSkipOnlyBlock}
      />
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'column'},
});
