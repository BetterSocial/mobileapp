import * as React from 'react';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';

import JWTDecode from 'jwt-decode';
import {useRoute, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import {upVoteDomain, downVoteDomain} from '../../service/vote';
import {getAccessToken} from '../../utils/token';
import Loading from '../Loading';
import Gap from '../../components/Gap';
import Header from './elements/Header';
import Navigation from './elements/Navigation';
import RenderItem from './elements/RenderItem';
import {getDetailDomains, getProfileDomain} from '../../service/domain';
import {SIZES, COLORS} from '../../utils/theme';
import BlockDomain from '../../components/Blocking/BlockDomain';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import ReportDomain from '../../components/Blocking/ReportDomain';
import {blockDomain} from '../../service/blocking';

const {width, height} = Dimensions.get('window');

const DomainScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const blockDomainRef = React.useRef(null);
  const refSpecificIssue = React.useRef(null);
  const refReportDomain = React.useRef(null);
  const [item, setItem] = React.useState(route.params.item);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [domain, setDomain] = React.useState(route.params.item.og.domain);
  const [idFromToken, setIdFromToken] = React.useState('');
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');

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

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      let res = await getDetailDomains(item.og.domain);
      if (res.code === 200) {
        setData([{dummy: true}, ...res.data]);
        setLoading(false);
      }
      setLoading(false);
    };
    init();
  }, [item]);

  React.useEffect(() => {
    const getProfile = async () => {
      let res = await getProfileDomain(domain);
      if (res.code === 200) {
        setProfile(res.data);
      }
    };
    getProfile();
  }, [domain]);

  const handleOnPressComment = (item) => {
    navigation.navigate('DetailDomainScreen', {item: item});
  };

  const upvoteNews = async (news) => {
    upVoteDomain(news);
  };

  const downvoteNews = async (news) => {
    downVoteDomain(news);
  };
  const onReaction = (v) => {
    if (v === 0) {
      blockDomainRef.current.open();
    }
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
      domainId: item.id,
      reason: reportOption,
      message: messageReport,
      source: 'domain_screen',
    };
    const result = await blockDomain(dataBlock);
    if (result.code === 200) {
      Toast.show(
        'The user was blocked successfully. \nThanks for making BetterSocial better!',
        Toast.LONG,
      );
    } else {
      Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
    console.log('result block user ', result);
  };

  return (
    <View style={styles.container}>
      <Navigation domain={item.og.domain} />
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          if (index === 0) {
            return (
              <View key={index} style={{backgroundColor: 'transparent'}}>
                <Header
                  image={profile.logo}
                  description={profile.short_description}
                  domain={profile.domain_name}
                  followers={10}
                  onPress={onReaction}
                />

                {/* <Gap height={SIZES.base} style={{backgroundColor: COLORS.gray1}}/> */}
              </View>
            );
          }

          if (item.content) {
            return (
              <RenderItem
                key={index}
                item={item}
                image={profile.logo}
                onPressComment={(item) => handleOnPressComment(item)}
                onPressUpvote={(news) => upvoteNews(news)}
                onPressDownVote={(news) => downvoteNews(news)}
                selfUserId={idFromToken}
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
    backgroundColor: 'white',
  },
  height: (h) => ({
    height: h,
  }),
});

export default DomainScreen;
