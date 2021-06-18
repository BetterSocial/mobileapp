import * as React from 'react';
import {View, SafeAreaView} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import JWTDecode from 'jwt-decode';
import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-simple-toast';

import RenderItem from './RenderItem';
import Loading from '../../components/Loading';
import CardStack from '../../components/CardStack';
import {ButtonNewPost} from '../../components/Button';
import BlockUser from '../../elements/Blocking/BlockUser';
import BlockDomain from '../../elements/Blocking/BlockDomain';
import ReportUser from '../../elements/Blocking/ReportUser';
import ReportDomain from '../../elements/Blocking/ReportDomain';
import SpecificIssue from '../../elements/Blocking/SpecificIssue';
import {getAccessToken} from '../../data/local/accessToken';
import {downVote, upVote} from '../../service/vote';
import {blockUser} from '../../service/blocking';
import {getMainFeed} from '../../service/post';
import {getToken} from '../../helpers/getToken';

const FeedScreen = (props) => {
  const [tokenParse, setTokenParse] = React.useState({});
  const [mainFeeds, setMainFeeds] = React.useState([]);

  const [initialLoading, setInitialLoading] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [countStack, setCountStack] = React.useState(null);
  const [username, setUsername] = React.useState('');
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [postId, setPostId] = React.useState('');
  const [lastId, setLastId] = React.useState('');
  const [selectedPost, setSelectedPost] = React.useState({});
  const [yourselfId, setYourselfId] = React.useState('');

  const refBlockUser = React.useRef();
  const refBlockDomain = React.useRef();
  const refReportUser = React.useRef();
  const refReportDomain = React.useRef();
  const refSpecificIssue = React.useRef();

  const onSelectBlocking = (v) => {
    if (v !== 1) {
      refReportUser.current.open();
    } else {
      userBlock();
    }
    refBlockUser.current.close();
  };

  const onNextQuestion = (v) => {
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
    if (result.code === 200) {
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

  useFocusEffect(
    React.useCallback(() => {
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
      getDataFeeds(lastId);
    }, [lastId]),
  );

  React.useEffect(() => {
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
    if (result.code === 200) {
      Toast.show('up vote was successful', Toast.LONG);
    } else {
      Toast.show('up vote failed', Toast.LONG);
    }
  };
  const setDownVote = async (id) => {
    let result = await downVote({activity_id: id});
    if (result.code === 200) {
      Toast.show('down vote success', Toast.LONG);
    } else {
      Toast.show('down vote failed', Toast.LONG);
    }
  };

  React.useEffect(() => {
    const parseToken = async () => {
      const value = await getAccessToken();
      if (value) {
        const decoded = await JWTDecode(value);
        setYourselfId(decoded.user_id);
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
    <SafeAreaView style={styles.container} forceInset={{top: 'always'}}>
      {mainFeeds !== undefined && (
        <CardStack
          style={styles.cardStack}
          renderNoMoreCards={() => {
            if (countStack === 0) {
              let id = mainFeeds[mainFeeds.length - 1].id;
              setLastId(id);
            }
          }}
          disableTopSwipe={false}
          disableLeftSwipe={true}
          disableRightSwipe={true}
          verticalSwipe={true}
          verticalThreshold={1}
          horizontalSwipe={false}
          disableBottomSwipe={true}
          onSwipedTop={() => {
            setCountStack(countStack - 1);
          }}>
          {mainFeeds !== undefined
            ? mainFeeds.map((item, index) => (
                <RenderItem
                  index={index}
                  key={index}
                  item={item}
                  onPress={() => {
                    props.navigation.navigate('PostDetailPage', {item: item});
                  }}
                  onPressBlock={(value) => {
                    if (value.actor.id === yourselfId) {
                      Toast.show("Can't Block yourself", Toast.LONG);
                    } else {
                      setDataToState(value);
                      refBlockUser.current.open();
                    }
                  }}
                  onPressComment={() => {
                    props.navigation.navigate('PostDetailPage', {item: item});
                  }}
                  onPressUpvote={(value) => {
                    setSelectedPost(value);
                    setUpVote(value.id);
                  }}
                  onPressDownVote={(value) => {
                    setSelectedPost(value);
                    setDownVote(value.id);
                  }}
                  selfUserId={yourselfId}
                  onPressDomain={() => {
                    console.log('onPress domain');
                    props.navigation.navigate('DomainScreen', {
                      item: item,
                    });
                  }}
                />
              ))
            : null}
        </CardStack>
      )}

      <Loading visible={loading} />

      <ButtonNewPost />

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

const styles = StyleSheet.create({
  cardStack: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  container: {flex: 1},
});

export default FeedScreen;
