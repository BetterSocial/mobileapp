import * as React from 'react';
import {View, StyleSheet, FlatList, StatusBar} from 'react-native';

import {useRoute, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';

import {upVoteDomain, downVoteDomain} from '../../service/vote';
import Loading from '../Loading';
import Header from './elements/Header';
import Navigation from './elements/Navigation';
import RenderItem from './elements/RenderItem';
import {getDetailDomains, getProfileDomain} from '../../service/domain';
import BlockDomain from '../../components/Blocking/BlockDomain';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import ReportDomain from '../../components/Blocking/ReportDomain';
import {blockDomain} from '../../service/blocking';
import {getUserId} from '../../utils/users';
import {COLORS} from '../../utils/theme';

const DomainScreen = () => {
  const route = useRoute();
  console.log(route.params.item);
  const navigation = useNavigation();
  const blockDomainRef = React.useRef(null);
  const refSpecificIssue = React.useRef(null);
  const refReportDomain = React.useRef(null);
  const [dataDomain, setDataDomain] = React.useState(route.params.item);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [domain, setDomain] = React.useState(route.params.item.og.domain);
  const [idFromToken, setIdFromToken] = React.useState('');
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setIdFromToken(id);
      }
    };
    parseToken();
  }, []);

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      let res = await getDetailDomains(dataDomain.og.domain);
      if (res.code === 200) {
        // console.log('dataDomain.og.domain');
        // console.log(res.data);
        setData([{dummy: true}, ...res.data]);
        setLoading(false);
      }
      setLoading(false);
    };
    init();
  }, [dataDomain]);

  React.useEffect(() => {
    const getProfile = async () => {
      let res = await getProfileDomain(domain);
      if (res.code === 200) {
        setProfile(res.data);
      } else {
        Toast.show('Domain Not Found', Toast.LONG);
        navigation.goBack();
      }
    };
    getProfile();
  }, [dataDomain]);

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

  const domainImage = dataDomain.domain
    ? dataDomain.domain.image
    : dataDomain.og.domainImage;
  // console.log('data domain ', domainImage);
  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      <Navigation domain={dataDomain.og.domain} />
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          if (index === 0) {
            return (
              <View key={index} style={{backgroundColor: 'transparent'}}>
                <Header
                  image={domainImage}
                  description={dataDomain.domain ? dataDomain.domain.info : ''}
                  domain={dataDomain.og.domain}
                  followers={10}
                  onPress={onReaction}
                  iddomain={dataDomain.content.domain_page_id}
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
                  style={styles.linearGradient}
                />
              </View>
            );
          }

          if (item.content) {
            return (
              <RenderItem
                key={index}
                item={item}
                image={profile.logo}
                onPressComment={(itemNews) => handleOnPressComment(itemNews)}
                onPressUpvote={(news) => upvoteNews(news)}
                onPressDownVote={(news) => downvoteNews(news)}
                selfUserId={idFromToken}
                onPressBlock={() => onReaction(0)}
              />
            );
          }
        }}
        style={styles.list}
        keyExtractor={(i) => i.id}
      />

      <Loading visible={loading} />
      <BlockDomain
        refBlockDomain={blockDomainRef}
        onSelect={selectBlock}
        domain={domain}
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
    </View>
  );
};

const styles = StyleSheet.create({
  list: {flex: 1},
  container: {
    flex: 1,
    // backgroundColor: COLORS.gray1,
    backgroundColor: COLORS.white,
  },
  height: (h) => ({
    height: h,
  }),
  linearGradient: {
    height: 8,
  },
});

export default DomainScreen;
