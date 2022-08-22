import * as React from 'react';
import JWTDecode from 'jwt-decode';
import { Linking, SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BlockDomainComponent from '../../../components/BlockDomain';
import ContentRelated from './ContentRelated';
import dimen from '../../../utils/dimen';
import { COLORS } from '../../../utils/theme';
import { Content, Header, LinkContextScreenFooter } from ".";
import { downVoteDomain, upVoteDomain } from '../../../service/vote';
import { fonts } from '../../../utils/fonts';
import { getAccessToken } from '../../../utils/token';
import { linkContextScreenParamBuilder, linkContextScreenSwitchScreenParam } from '../../../utils/navigation/paramBuilder';

const LinkContextItem = ({
  item,
  showBackButton = true,
  setFollow,
  follow = false,
  isFirstItem = false,
}) => {
  const navigation = useNavigation();
  const domainImage = item.domain.image;
  const domainName = item.domain.name;
  const postTime = item.time;

  const refBlockDomainComponent = React.useRef(null);
  const [idFromToken, setIdFromToken] = React.useState('');

  const onReaction = async (v) => {
    refBlockDomainComponent.current.openBlockDomain();
  };

  const handleOnPressComment = (itemNews) => {
    navigation.navigate('DetailDomainScreen', {
      item: {
        ...item,
        score: item?.domain?.credderScore,
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

  const onContentPressed = () => {
    // navigation.navigate('DetailDomainScreen', {
    //   item: {
    //     ...item,
    //     score: item?.domain?.credderScore,
    //     follower: 0,
    //   }
    // });

    if (isFirstItem && Linking.canOpenURL(item?.content?.news_url)) {
      return Linking.openURL(item?.content?.news_url);
    }

    const param = linkContextScreenSwitchScreenParam(item, item?.domain?.name, item?.domain?.image, item?.domain?.domain_page_id)
    navigation.push('LinkContextScreen', param)
  };

  React.useEffect(() => {
    const parseToken = async () => {
      const value = await getAccessToken();
      if (value) {
        const decoded = await JWTDecode(value);
        setIdFromToken(decoded.user_id);
      }
    };
    parseToken();
  }, []);

  return (
    <View style={ isFirstItem ? styles.containerFirstItem : styles.containerRelated}>
      <Header
        item={item}
        name={domainName}
        image={domainImage}
        time={postTime}
        onFollowDomainPressed={() => { }}
        setFollow={setFollow}
        follow={follow}
        showBackButton={showBackButton}
      />
      { isFirstItem ? <Content item={item} onContentPressed={onContentPressed} /> : <ContentRelated item={item} onContentPressed={onContentPressed} />}
      <LinkContextScreenFooter
        item={item}
        itemId={item.id}
        onPressBlock={() => onReaction(0)}
        onPressComment={() => handleOnPressComment(item)}
        onPressUpvote={(news) => upvoteNews(news)}
        onPressDownVote={(news) => downvoteNews(news)}
        selfUserId={idFromToken}
      />
      <View
        style={{
          height: 6,
          width: '100%',
          backgroundColor: COLORS.lightgrey,
        }}
      />

      <BlockDomainComponent
        ref={refBlockDomainComponent}
        domain={item.domain.name}
        domainId={item.domain.domain_page_id}
        screen="link_context_screen" />
    </View>
  );
};

const styles = StyleSheet.create({
  containerFirstItem: {
    backgroundColor: COLORS.white,
    // flex: 1,
    display: 'flex',
    height: dimen.size.FEED_CURRENT_ITEM_HEIGHT
  },
  containerRelated: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  bottomAnchorContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
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

export default LinkContextItem;
