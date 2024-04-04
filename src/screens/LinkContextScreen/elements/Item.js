import * as React from 'react';
import JWTDecode from 'jwt-decode';
import {Linking, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import BlockDomainComponent from '../../../components/BlockDomain';
import ContentRelated from './ContentRelated';
import ShareUtils from '../../../utils/share';
import dimen from '../../../utils/dimen';
import TokenStorage, {ITokenEnum} from '../../../utils/storage/custom/tokenStorage';
import {COLORS} from '../../../utils/theme';
import {Content, Header, LinkContextScreenFooter} from '.';
import {downVoteDomain, upVoteDomain} from '../../../service/vote';
import {fonts} from '../../../utils/fonts';
import {linkContextScreenSwitchScreenParam} from '../../../utils/navigation/paramBuilder';
import {openUrl} from '../../../utils/Utils';

const LinkContextItem = ({
  item,
  showBackButton = true,
  setFollow,
  follow = false,
  isFirstItem = false
}) => {
  const navigation = useNavigation();
  const domainImage = item.domain.image;
  const domainName = item.domain.name;
  const postTime = item.time;

  const refBlockDomainComponent = React.useRef(null);
  const [idFromToken, setIdFromToken] = React.useState('');

  const onReaction = async () => {
    refBlockDomainComponent.current.openBlockDomain();
  };

  const handleOnPressComment = () => {
    navigation.navigate('DetailDomainScreen', {
      item: {
        ...item,
        score: item?.domain?.credderScore,
        follower: 0
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
    const url = item?.content?.news_url || item?.content?.url;
    if (isFirstItem && Linking.canOpenURL(url)) {
      return openUrl(url, true);
    }

    const param = linkContextScreenSwitchScreenParam(
      item,
      item?.domain?.name,
      item?.domain?.image,
      item?.domain?.domain_page_id
    );
    return navigation.push('LinkContextScreen', param);
  };

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

  return (
    <View style={isFirstItem ? styles.containerFirstItem : styles.containerRelated}>
      <Header
        item={item}
        name={domainName}
        image={domainImage}
        time={postTime}
        onFollowDomainPressed={() => {}}
        setFollow={setFollow}
        follow={follow}
        showBackButton={showBackButton}
      />
      {isFirstItem ? (
        <Content item={item} onContentPressed={onContentPressed} />
      ) : (
        <ContentRelated item={item} onContentPressed={onContentPressed} />
      )}
      <LinkContextScreenFooter
        item={item}
        itemId={item.id}
        onPressBlock={onReaction}
        onPressComment={handleOnPressComment}
        onPressUpvote={(news) => upvoteNews(news)}
        onPressDownVote={(news) => downvoteNews(news)}
        onPressShare={ShareUtils.shareNews}
        selfUserId={idFromToken}
      />
      <View
        style={{
          height: 6,
          width: '100%',
          backgroundColor: COLORS.gray100
        }}
      />

      <BlockDomainComponent
        ref={refBlockDomainComponent}
        domain={item.domain.name}
        domainId={item.domain.domain_page_id}
        screen="link_context_screen"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerFirstItem: {
    backgroundColor: COLORS.almostBlack,
    // flex: 1,
    display: 'flex',
    height: dimen.size.FEED_CURRENT_ITEM_HEIGHT
  },
  containerRelated: {
    backgroundColor: COLORS.almostBlack,
    flex: 1
  },
  bottomAnchorContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center'
  },
  postArrowUpImage: {
    width: 48,
    height: 48,
    marginBottom: 6,
    alignSelf: 'center'
  },
  bottomAnchorTextContainer: {
    backgroundColor: COLORS.anon_primary,
    padding: 11,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  bottomAnchorSwipeText: {
    fontFamily: fonts.inter[500],
    color: COLORS.almostBlack,
    fontSize: 14
  }
});

export default LinkContextItem;
