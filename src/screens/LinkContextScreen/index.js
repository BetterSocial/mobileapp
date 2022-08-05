import * as React from 'react';
import JWTDecode from 'jwt-decode';
import {
  Animated,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import LinkContextItem from './elements/Item';
import Loading from '../Loading';
import PostArrowUp from '../../assets/images/post-arrow-up.png';
import { COLORS } from '../../utils/theme';
import { Context } from '../../context';
import { downVoteDomain, upVoteDomain } from '../../service/vote';
import { fonts } from '../../utils/fonts';
import { getAccessToken } from '../../utils/token';
import {
  getDetailDomains,
  getDomainIdIFollow,
  getLinkContextScreenRelated,
} from '../../service/domain';
import { setIFollow } from '../../context/actions/news';

const LinkContextScreen = () => {
  const route = useRoute();

  const { item } = route.params;
  const domainName = item.domain.name;
  const iddomain = item.content.domain_page_id;

  const navigation = useNavigation();
  const [dataDomain, setDataDomain] = React.useState(route.params.item);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [domain, setDomain] = React.useState(item.domainId);
  const [idFromToken, setIdFromToken] = React.useState('');
  const [follow, setFollow] = React.useState(false);
  const [news, dispatch] = React.useContext(Context).news;
  const [featuredNewsFromFeed, setFeaturedNewsFromFeed] = React.useState(item);

  const { ifollow } = news;

  const animatedBottomAnchorContainerValue = React.useRef(
    new Animated.Value(0),
  ).current;

  React.useEffect(() => {
    const parseToken = async () => {
      const value = await getAccessToken();
      if (value) {
        const decoded = await JWTDecode(value);
        setIdFromToken(decoded.user_id);
      }
    };
    // console.log('parseToken')
    parseToken();
  }, []);

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      const res = await getLinkContextScreenRelated(item?.content?.news_link_id);
      console.log(`res.data ${  res.data.length} ${res}`)
      if (res.data) {
        const reducedData = res?.data?.results?.reduce((acc, currentItem) => {
          const newItem = { ...currentItem }
          newItem.domain.credderScore = dataDomain?.domain?.credderScore
          acc.push(newItem)
          return acc;
        }, []);
        setData([{ dummy: true }, ...reducedData]);
        setLoading(false);
      }
      setLoading(false);
    };
    init();
  }, [dataDomain]);

  React.useEffect(() => {
    getIFollow();
  }, [iddomain, ifollow]);

  const getIFollow = async () => {
    if (ifollow.length === 0) {
      const res = await getDomainIdIFollow();
      setIFollow(res.data, dispatch);
    } else {
      // console.log(JSON.stringify(ifollow).includes(iddomain));
      setFollow(JSON.stringify(ifollow).includes(iddomain));
    }
  };

  const handleOnPressComment = (itemNews) => {
    navigation.navigate('DetailDomainScreen', {
      item: {
        ...itemNews,
        score: itemNews?.domain?.credderScore,
        follower: 0,
      }
    });
  };

  const upvoteNews = async (news) => {
    upVoteDomain(news);
  };

  const downvoteNews = async (news) => {
    downVoteDomain(news);
  };

  const handleOnScroll = (event) => {
    const {y} = event.nativeEvent.contentOffset;
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

  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      <FlatList
        data={data}
        onScroll={handleOnScroll}
        initialNumToRender={5}
        renderItem={(props) => {
          const singleItem = props.item;
          const { index } = props;

          if (index === 0) {
            return (
              <LinkContextItem
                item={featuredNewsFromFeed}
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
  list: {
    // flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  height: (h) => ({
    height: h,
  }),
  bottomAnchorContainer: (animatedValue) => ({
      position: 'absolute',
      bottom: animatedValue,
      alignSelf: 'center',
    }),
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
