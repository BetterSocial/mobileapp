/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import * as React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RecentSearch from '../elements/RecentSearch';
import RenderItem from '../elements/RenderItem';
import share from '../../../utils/share';
import useIsReady from '../../../hooks/useIsReady';
import {Context} from '../../../context/Store';
import {fonts} from '../../../utils/fonts';
import {getUserId} from '../../../utils/users';
import {newsDiscoveryContentParamBuilder} from '../../../utils/navigation/paramBuilder';
import {withInteractionsManaged} from '../../../components/WithInteractionManaged';
import {COLORS} from '../../../utils/theme';

const NewsFragment = ({
  isLoadingDiscoveryNews = false,
  isFirstTimeOpen,
  setSearchText = () => {},
  setIsFirstTimeOpen = () => {},
  news = []
}) => {
  const [myId, setMyId] = React.useState('');
  const [defaultNews] = React.useContext(Context).news;

  const isReady = useIsReady();

  const navigation = useNavigation();

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setMyId(id);
      }
    };
    parseToken();
  }, []);

  // React.useEffect(() => {
  //     if(news.length > 0) setIsFirstTimeOpen(false)
  // }, [news])

  const renderNewsItem = () => {
    if (isFirstTimeOpen) {
      return [<DiscoveryTitleSeparator key="news-title-separator" text="Suggested News" />].concat(
        defaultNews.news.map((item, index) => {
          const onContentClicked = () => {
            navigation.navigate('DetailDomainScreen', {
              item: {
                id: item.id,
                score: item.domain.credderScore,
                follower: 0
              }
            });
          };

          // Disable on press content if view should be navigated to LinkContextScreen
          if (!item.dummy)
            return (
              <RenderItem
                key={`news-screen-item-${index}`}
                item={item}
                selfUserId={myId}
                // onPressContent={onContentClicked}
              />
            );
        })
      );
    }

    return news.map((item, index) => {
      const contentParam = newsDiscoveryContentParamBuilder(
        item.title,
        item.image,
        item.description,
        item.news_url,
        item?.newsLinkDomain?.logo,
        item?.newsLinkDomain?.domain_name || item?.site_name,
        item.createdAt,
        item.news_link_id,
        item?.newsLinkDomain?.credder_score,
        item?.post_id
      );

      const onContentClicked = () => {
        navigation.navigate('DetailDomainScreen', {
          item: {
            id: item.post_id,
            score: item?.newsLinkDomain?.credder_score
          }
        });
      };

      return (
        <RenderItem
          key={`newsDiscovery-${index}`}
          selfUserId={myId}
          item={contentParam}
          onPressShare={share.shareNews}
          // onPressContent={onContentClicked}
        />
      );
    });
  };

  if (!isReady) return <></>;

  if (isLoadingDiscoveryNews)
    return (
      <View style={styles.fragmentContainer}>
        <LoadingWithoutModal />
      </View>
    );
  if (news.length === 0 && !isFirstTimeOpen)
    return (
      <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No news found</Text>
      </View>
    );

  return (
    <ScrollView>
      <RecentSearch
        shown={isFirstTimeOpen}
        setSearchText={setSearchText}
        setIsFirstTimeOpen={setIsFirstTimeOpen}
      />
      {renderNewsItem()}
      <View style={styles.padding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fragmentContainer: {
    flex: 1,
    backgroundColor: COLORS.gray110
  },
  noDataFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.almostBlack,
    justifyContent: 'center'
  },
  noDataFoundText: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: fonts.inter[600],
    color: COLORS.white
  },
  padding: {
    height: 16
  },
  unfollowedHeaders: {
    fontFamily: fonts.inter[600],
    marginLeft: 20
  }
});

export default NewsFragment;
