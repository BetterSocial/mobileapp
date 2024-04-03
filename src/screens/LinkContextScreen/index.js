import * as React from 'react';
import JWTDecode from 'jwt-decode';
import {Animated, FlatList, Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';

import LinkContextItem from './elements/Item';
import Loading from '../Loading';
import PostArrowUp from '../../assets/icon/IconPostArrowUp';
import TopicPageLabel from '../../components/Label/TopicPageLabel';
import TokenStorage, {ITokenEnum} from '../../utils/storage/custom/tokenStorage';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {fonts} from '../../utils/fonts';
import {getDomainIdIFollow, getLinkContextScreenRelated} from '../../service/domain';
import {setIFollow} from '../../context/actions/news';

const VIEW_MAIN_NEWS_INDEX = 0;
const VIEW_RELATED_LINKS_LABEL = 1;

const LinkContextScreen = () => {
  const route = useRoute();

  const {item} = route.params;
  const iddomain = item.content.domain_page_id;

  const [dataDomain] = React.useState(route.params.item);
  const [data, setData] = React.useState([]);
  const [, setLoading] = React.useState(false);
  const [, setIdFromToken] = React.useState('');
  const [follow, setFollow] = React.useState(false);
  const [news, dispatch] = React.useContext(Context).news;
  const [featuredNewsFromFeed] = React.useState(item);

  const {ifollow} = news;

  const animatedBottomAnchorContainerValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const parseToken = async () => {
      const value = TokenStorage.get(ITokenEnum.token);
      if (value) {
        const decoded = await JWTDecode(value);
        setIdFromToken(decoded.user_id);
      }
    };
    parseToken();
  }, []);

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      const res = await getLinkContextScreenRelated(item?.content?.news_link_id);
      if (res.data) {
        const reducedData = res?.data?.results?.reduce((acc, currentItem) => {
          const newItem = {...currentItem};
          newItem.domain.credderScore = dataDomain?.domain?.credderScore;
          acc.push(newItem);
          return acc;
        }, []);
        setData([{dummy: true}, {label: true}, ...reducedData]);
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
      setFollow(JSON.stringify(ifollow).includes(iddomain));
    }
  };

  const handleOnScroll = (event) => {
    const {y} = event.nativeEvent.contentOffset;
    if (y > 50) {
      Animated.timing(animatedBottomAnchorContainerValue, {
        toValue: -(y - 50),
        duration: 50,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(animatedBottomAnchorContainerValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <FlatList
        data={data}
        onScroll={handleOnScroll}
        initialNumToRender={5}
        renderItem={(props) => {
          const singleItem = props.item;
          const {index} = props;

          if (index === VIEW_MAIN_NEWS_INDEX) {
            return (
              <LinkContextItem
                item={featuredNewsFromFeed}
                follow={follow}
                isFirstItem={true}
                setFollow={(followParam) => setFollow(followParam)}
              />
            );
          }

          if (index === VIEW_RELATED_LINKS_LABEL) {
            return <TopicPageLabel label="Related Links" />;
          }

          if (singleItem.content) {
            return (
              <LinkContextItem
                item={singleItem}
                showBackButton={false}
                follow={follow}
                isFirstItem={false}
                setFollow={(followParam) => setFollow(followParam)}
              />
            );
          }

          return <></>;
        }}
        style={styles.list}
        keyExtractor={(i) => i.id}
      />
      {data.length > 1 && (
        <Animated.View style={styles.bottomAnchorContainer(animatedBottomAnchorContainerValue)}>
          <PostArrowUp fill={COLORS.signed_secondary} style={styles.postArrowUpImage} />
          <View style={styles.bottomAnchorTextContainer}>
            <Text style={styles.bottomAnchorSwipeText}>Swipe for related articles</Text>
          </View>
        </Animated.View>
      )}

      <Loading visible={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: COLORS.almostBlack
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  height: (h) => ({
    height: h
  }),
  bottomAnchorContainer: (animatedValue) => ({
    position: 'absolute',
    bottom: animatedValue,
    alignSelf: 'center'
  }),
  postArrowUpImage: {
    width: 48,
    height: 48,
    marginBottom: 6,
    alignSelf: 'center'
  },
  bottomAnchorTextContainer: {
    backgroundColor: COLORS.signed_secondary,
    padding: 11,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  bottomAnchorSwipeText: {
    fontFamily: fonts.inter[500],
    color: COLORS.white2,
    fontSize: 14
  }
});

export default LinkContextScreen;
