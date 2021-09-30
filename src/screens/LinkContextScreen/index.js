import * as React from 'react';
import {View, StyleSheet, FlatList, Image, Text, Animated} from 'react-native';

import JWTDecode from 'jwt-decode';
import {useRoute, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import {upVoteDomain, downVoteDomain} from '../../service/vote';
import {getAccessToken, getUserId} from '../../utils/token';
import Loading from '../Loading';
import {
  getDetailDomains,
  getDomainIdIFollow,
  getProfileDomain,
} from '../../service/domain';
import {blockDomain} from '../../service/blocking';
import LinkContextItem from './elements/Item';
import PostArrowUp from '../../assets/images/post-arrow-up.png';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';
import RenderItem from '../DomainScreen/elements/RenderItem';
import {Context} from '../../context';
import {createIconSetFromFontello} from 'react-native-vector-icons';

const LinkContextScreen = () => {
  const route = useRoute();

  let {item} = route.params;
  console.log('itemsssss');
  console.log(route.params);
  let domainImage = item.domain.image;
  let domainName = item.domain.name;
  let iddomain = item.content.domain_page_id;
  let postTime = item.time;

  const navigation = useNavigation();
  const blockDomainRef = React.useRef(null);
  const refSpecificIssue = React.useRef(null);
  const refReportDomain = React.useRef(null);
  const [dataDomain, setDataDomain] = React.useState(route.params.item);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [domain, setDomain] = React.useState(item.domainId);
  const [idFromToken, setIdFromToken] = React.useState('');
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');
  const [follow, setFollow] = React.useState(false);
  const [news, dispatch] = React.useContext(Context).news;

  let {ifollow} = news;
  console.log('ifollow ');
  console.log(ifollow);

  const animatedBottomAnchorContainerValue = React.useRef(new Animated.Value(0))
    .current;

  React.useEffect(() => {
    const parseToken = async () => {
      const value = await getAccessToken();
      if (value) {
        const decoded = await JWTDecode(value);
        setIdFromToken(decoded.user_id);
      }

      let selfUserId = await getUserId();
      console.log(selfUserId);
    };
    parseToken();
    console.log('ini LinkContextScreen');
  }, []);

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      let res = await getDetailDomains(domainName);
      if (res.code === 200) {
        let reducedData = res.data.reduce((acc, currentItem) => {
          if (currentItem.content.news_link_id !== item.content.news_link_id) {
            acc.push(currentItem);
          }
          return acc;
        }, []);
        setData([{dummy: true}, ...reducedData]);
        setLoading(false);
      }
      setLoading(false);
    };
    init();
  }, [dataDomain]);

  // React.useEffect(() => {
  //   const getProfile = async () => {
  //     let res = await getProfileDomain(domain);
  //     if (res.code === 200) {
  //       setProfile(res.data);
  //     } else {
  //       Toast.show('Domain Not Found', Toast.LONG);
  //       navigation.goBack();
  //     }
  //   };
  //   getProfile();
  // }, [dataDomain]);

  React.useEffect(() => {
    getIFollow();
  }, [iddomain, ifollow]);

  const getIFollow = async () => {
    console.log('reszxczxczc');
    // console.log(res.data)
    if (ifollow.length === 0) {
      let res = await getDomainIdIFollow();
      console.log('res123');
      console.log(res.data);
      setIFollow(res.data, dispatch);
    } else {
      console.log('resqeqwe');
      console.log(JSON.stringify(ifollow).includes(iddomain));
      setFollow(JSON.stringify(ifollow).includes(iddomain));
    }
  };

  const handleOnPressComment = (itemNews) => {
    navigation.navigate('DetailDomainScreen', {item: itemNews});
  };

  const upvoteNews = async (news) => {
    upVoteDomain(news);
  };

  const downvoteNews = async (news) => {
    downVoteDomain(news);
  };
  const onReaction = async (v) => {
    blockDomainRef.current.open();
  };
  const selectBlock = (v) => {
    if (v === 1) {
      onBlockDomain();
    } else {
      refReportDomain.current.open();
    }
    blockDomainRef.current.close();
  };
  const getSpecificIssue = (v) => {
    setMessageReport(v);
    refSpecificIssue.current.close();
    setTimeout(() => {
      onBlockDomain();
    }, 500);
  };
  const onSkipOnlyBlock = () => {
    refReportDomain.current.close();
    refSpecificIssue.current.close();
    onBlockDomain();
  };
  const onNextQuestion = (v) => {
    setReportOption(v);
    refReportDomain.current.close();
    refSpecificIssue.current.open();
  };

  const onBlockDomain = async () => {
    const dataBlock = {
      domainId: dataDomain.content.domain_page_id,
      reason: reportOption,
      message: messageReport,
      source: 'domain_screen',
    };
    const result = await blockDomain(dataBlock);
    if (result.code === 200) {
      Toast.show(
        'The domain was blocked successfully. \nThanks for making BetterSocial better!',
        Toast.LONG,
      );
    } else {
      Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
    console.log('result block user ', result);
  };

  const handleOnScroll = (event) => {
    let y = event.nativeEvent.contentOffset.y;
    if (y > 50) {
      Animated.timing(animatedBottomAnchorContainerValue, {
        toValue: -(y - 50),
        duration: 50,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedBottomAnchorContainerValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }).start();
    }
  };
  // console.log('data domain ', dataDomain);
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        onScroll={handleOnScroll}
        renderItem={(props) => {
          let singleItem = props.item;
          let {index} = props;

          if (index === 0) {
            return (
              <LinkContextItem
                item={item}
                follow={follow}
                setFollow={(follow) => setFollow(follow)}
              />
            );
          }

          if (singleItem.content) {
            return (
              <LinkContextItem
                item={singleItem}
                showBackButton={false}
                follow={follow}
                setFollow={(follow) => setFollow(follow)}
              />
            );
          }
        }}
        style={styles.list}
        keyExtractor={(i) => i.id}
      />
      {data.length > 1 && (
        <Animated.View
          style={styles.bottomAnchorContainer(
            animatedBottomAnchorContainerValue,
          )}>
          <Image source={PostArrowUp} style={styles.postArrowUpImage} />
          <View style={styles.bottomAnchorTextContainer}>
            <Text style={styles.bottomAnchorSwipeText}>
              Swipe for related articles
            </Text>
          </View>
        </Animated.View>
      )}

      <Loading visible={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {flex: 1},
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  height: (h) => ({
    height: h,
  }),
  bottomAnchorContainer: (animatedValue) => {
    return {
      position: 'absolute',
      bottom: animatedValue,
      alignSelf: 'center',
    };
  },
  postArrowUpImage: {
    width: 48,
    height: 48,
    marginBottom: 6,
    alignSelf: 'center',
  },
  bottomAnchorTextContainer: {
    backgroundColor: COLORS.bondi_blue,
    padding: 11,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bottomAnchorSwipeText: {
    fontFamily: fonts.inter[500],
    color: COLORS.white,
    fontSize: 14,
  },
});

export default LinkContextScreen;
