import React from 'react'
import { Animated, InteractionManager } from 'react-native';
import { useNavigation } from "@react-navigation/core";
import { Context } from '../../../context';
import { getSpecificCache, saveToCache } from '../../../utils/cache';
import { setIFollow, setNews } from '../../../context/actions/news';
import { getDomainIdIFollow, getDomains } from '../../../service/domain';
import { NEWS_CACHE } from '../../../utils/cache/constant';
import { downVoteDomain, upVoteDomain } from '../../../service/vote';

const useNews = () => {
    const navigation = useNavigation();
    const refBlockDomainComponent = React.useRef(null);
    const offset = React.useRef(new Animated.Value(0)).current;
    const paddingContainer = React.useRef(new Animated.Value(50)).current
    const [refreshing, setRefreshing] = React.useState(false);
    const [domain, setDomain] = React.useState('');
    const [idBlock, setIdBlock] = React.useState('');
    const [postOffset, setPostOffset] = React.useState(0)
    const [newslist, dispatch] = React.useContext(Context).news;
    const [profileContext] = React.useContext(Context).profile;
    const { myProfile } = profileContext
  // const [isCompleteAnimation, setIsCompleteAnimation] = React.useState(false)

//   const scrollRef = React.createRef();
  const { news } = newslist;
      let lastDragY = 0;
    const checkCache = () => {
    getSpecificCache(NEWS_CACHE, (cache) => {
      if (cache) {
        setNews(cache.data, dispatch);
        setPostOffset(cache.offset)
      } else {
        initData()
      }
    })
  }

    const initData = async () => {
    try {
      const res = await getDomains();
      saveToCache(NEWS_CACHE, res)
      setNews(res.data, dispatch);
      setPostOffset(res.offset)
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
    }
  };

    const onRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await getDomains();
      setNews(res.data, dispatch);
      setPostOffset(res.offset)
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  }

  const getNewsIfollow = async () => {
    const res = await getDomainIdIFollow();
    setIFollow(res.data, dispatch);
  };

  const handleScrollEvent = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    const dy = y - lastDragY;
    if (dy + 20 <= 0) {
      InteractionManager.runAfterInteractions(() => {
        Animated.timing(offset, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(paddingContainer, {
          toValue: 50,
          duration: 100,
          useNativeDriver: false,
        }).start()

      })

    } else if (dy - 20 > 0) {

      InteractionManager.runAfterInteractions(() => {
        Animated.timing(offset, {
          toValue: -50,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(paddingContainer, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }).start()

      })
    }
  };

  const handleOnScrollBeginDrag = (event) => {
    lastDragY = event.nativeEvent.contentOffset.y;
  };

  const comment = (item) => {
    navigation.navigate('DetailDomainScreen', {
      item: {
        ...item,
        score: item?.domain?.credderScore,
        follower: 0,
      },
      refreshNews: onRefresh
    });
  };

  const blockNews = (itemNews) => {
    setIdBlock(itemNews.content.domain_page_id);
    setDomain(itemNews.domain.name);
  };

  const upvoteNews = async (itemNews) => {
    upVoteDomain(itemNews);
  };

  const downvoteNews = async (itemNews) => {
    downVoteDomain(itemNews);
  };
  console.log(postOffset, 'lalak')
  const loadMoreData = async () => {
    if(postOffset > 0) {
      setRefreshing(true)
    }
    try {
      const res = await getDomains(postOffset);
      const newNews = [...news, ...res.data];
      const data = {
        ...res,
        data: newNews
      }
      setPostOffset(res.offset)
      setNews(newNews, dispatch);
      saveToCache(NEWS_CACHE, data)
      setRefreshing(false)
    } catch (error) {
      setRefreshing(false)
    }
  };


  const onBlockedDomain = (blockedDomain) => {
    if (!blockedDomain.data) return

    const { domain_page_id } = blockedDomain.data
    getSpecificCache(NEWS_CACHE, (cache) => {
      if (cache) {
        if (!cache?.data) {
          initData()
          return
        }

        const filteredCache = cache.data.filter((item) => item.content.domain_page_id !== domain_page_id)
        if(filteredCache.length === 0) {
          initData()
          return
        }

        const newCache = { ...cache }
        newCache.data = filteredCache
        setNews(filteredCache, dispatch);
        saveToCache(NEWS_CACHE, newCache)
      } else {
        initData()
      }
    })
  }

  const keyExtractor = React.useCallback((item, index) => index.toString(), [])

  return {
    checkCache,
    initData,
    onRefresh,
    refreshing,
    onBlockedDomain,
    loadMoreData, 
    downvoteNews,
    upvoteNews,
    blockNews,
    comment,
    handleOnScrollBeginDrag,
    handleScrollEvent,getNewsIfollow,
    // scrollRef,
    keyExtractor,
    domain,
    idBlock , 
    newslist,
    news,
    myProfile,
    paddingContainer,
    offset,
    refBlockDomainComponent
  }

}


export default useNews