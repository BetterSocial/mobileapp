import * as React from 'react';
import JWTDecode from 'jwt-decode';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import BlockDomainComponent from '../../../components/BlockDomain';
import {COLORS} from '../../../utils/theme';
import {Content, Header, LinkContextScreenFooter} from './';
import {downVoteDomain, upVoteDomain} from '../../../service/vote';
import {fonts} from '../../../utils/fonts';
import {getAccessToken} from '../../../utils/token';

const LinkContextItem = ({
  item,
  showBackButton = true,
  setFollow,
  follow = false,
}) => {
  const navigation = useNavigation();
  let domainImage = item.domain.image;
  let domainName = item.domain.name;
  let postTime = item.time;

  const refBlockDomainComponent = React.useRef(null);
  const [idFromToken, setIdFromToken] = React.useState('');

  const onReaction = async (v) => {
    refBlockDomainComponent.current.openBlockDomain();
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

  const onContentPressed = () => {
    navigation.navigate('DetailDomainScreen', {item});
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
    <View style={styles.container}>
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
      <Content item={item} onContentPressed={onContentPressed} />
      <LinkContextScreenFooter
        item={item}
        itemId={item.id}
        onPressBlock={() => onReaction(0)}
        onPressComment={(itemNews) => handleOnPressComment(itemNews)}
        onPressUpvote={(news) => upvoteNews(news)}
        onPressDownVote={(news) => downvoteNews(news)}
        selfUserId={idFromToken}
      />
      <View
        style={{
          height: 8,
          width: '100%',
          backgroundColor: COLORS.gray1,
        }}
      />

      <BlockDomainComponent 
        ref={refBlockDomainComponent}
        domain={item.domain.name}
        domainId={item.domain.domain_page_id}
        screen="link_context_screen" />

      {/* <View style={styles.bottomAnchorContainer}>
        <Image source={PostArrowUp} style={styles.postArrowUpImage} />
        <View style={styles.bottomAnchorTextContainer}>
          <Text style={styles.bottomAnchorSwipeText}>
            Swipe for related articles
          </Text>
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
