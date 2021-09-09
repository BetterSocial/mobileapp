import * as React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import JWTDecode from 'jwt-decode';

import BlockDomain from '../../../components/Blocking/BlockDomain';
import SpecificIssue from '../../../components/Blocking/SpecificIssue';
import ReportDomain from '../../../components/Blocking/ReportDomain';
import {Header, Content, LinkContextScreenFooter} from './';
import {COLORS} from '../../../utils/theme';
import {blockDomain} from '../../../service/blocking';
import {upVoteDomain, downVoteDomain} from '../../../service/vote';
import {getAccessToken} from '../../../utils/token';
import {fonts} from '../../../utils/fonts';
import PostArrowUp from '../../../assets/images/post-arrow-up.png';

const LinkContextItem = ({item, showBackButton = true, setFollow, follow = false,}) => {
  const navigation = useNavigation();
  // console.log('JSON.stringify(route.params)');
  // console.log(JSON.stringify(route.params.item));
  let domainImage = item.domain.image;
  let domainName = item.domain.name;
  let postTime = item.time;

  const blockDomainRef = React.useRef(null);
  const refSpecificIssue = React.useRef(null);
  const refReportDomain = React.useRef(null);
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');
  const [dataDomain, setDataDomain] = React.useState(item.domain);
  const [idFromToken, setIdFromToken] = React.useState('');

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

  const onNextQuestion = (v) => {
    setReportOption(v);
    refReportDomain.current.close();
    refSpecificIssue.current.open();
  };

  const onSkipOnlyBlock = () => {
    refReportDomain.current.close();
    refSpecificIssue.current.close();
    onBlockDomain();
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

  const onReaction = async (v) => {
    blockDomainRef.current.open();
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
      <BlockDomain
        refBlockDomain={blockDomainRef}
        onSelect={selectBlock}
        domain={item.domain}
      />
      <SpecificIssue
        refSpecificIssue={refSpecificIssue}
        onPress={getSpecificIssue}
        onSkip={onSkipOnlyBlock}
      />
      <ReportDomain
        refReportDomain={refReportDomain}
        onSkip={onSkipOnlyBlock}
        onSelect={onNextQuestion}
      />
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
