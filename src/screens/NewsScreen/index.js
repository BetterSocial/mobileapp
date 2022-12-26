import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import {
  Animated,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import BlockDomainComponent from '../../components/BlockDomain';
import RenderItem from './RenderItem';
import Search from './Search';
import ShareUtils from '../../utils/share';
import { COLORS } from '../../utils/theme';
import { useAfterInteractions } from '../../hooks/useAfterInteractions';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
import useNews from './hooks/useNews';

const NewsScreen = () => {
  const navigation = useNavigation();
  const { interactionsComplete } = useAfterInteractions()
  const {checkCache, getNewsIfollow, onRefresh, handleScrollEvent, handleOnScrollBeginDrag, comment, blockNews, upvoteNews, downvoteNews, loadMoreData, onBlockedDomain, keyExtractor, domain, idBlock, news, refreshing, myProfile, paddingContainer, offset, refBlockDomainComponent} = useNews()
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      offset.setValue(0)
    });

    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed',
    });

    return () => unsubscribe();
  }, []);


  React.useEffect(() => {
    if (interactionsComplete) {
      checkCache()
      getNewsIfollow();
    }

  }, [interactionsComplete]);

  
  React.useEffect(() => {
    if (interactionsComplete) {
      if (domain !== '' && idBlock !== '') {
        refBlockDomainComponent.current.openBlockDomain();
      }
    }

  }, [domain, idBlock, interactionsComplete])

  
  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar translucent={false} />
      <Search animatedValue={offset} />
      <Animated.View style={{ paddingTop: Platform.OS === 'android' ? paddingContainer : 0 }}>
        <FlatList
          contentInsetAdjustmentBehavior='automatic'
          keyExtractor={keyExtractor}
          onScrollBeginDrag={handleOnScrollBeginDrag}
          onScroll={handleScrollEvent}
          scrollEventThrottle={16}
          data={news}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={loadMoreData}
          contentContainerStyle={styles.flatlistContainer}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={10}
          windowSize={10}
          renderItem={({ item, index }) => (
            <RenderItem
              key={index}
              item={item}
              onPressShare={ShareUtils.shareNews}
              onPressComment={(itemNews) => comment(itemNews)}
              onPressBlock={(itemNews) => blockNews(itemNews)}
              onPressUpvote={(itemNews) => upvoteNews(itemNews)}
              onPressDownVote={(itemNews) => downvoteNews(itemNews)}
              selfUserId={myProfile.user_id}
            />
          )}
        />
      </Animated.View>

      <BlockDomainComponent
        ref={refBlockDomainComponent}
        domain={domain}
        domainId={idBlock}
        screen="news_screen"
        getValueBlock={onBlockedDomain} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray6,
  },
  containerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  flatlistContainer: {
    paddingTop: 10
  }
});

export default React.memo(withInteractionsManaged(NewsScreen));
