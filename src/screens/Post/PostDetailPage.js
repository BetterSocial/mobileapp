import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import JWTDecode from 'jwt-decode';
import {getAccessToken} from '../../data/local/accessToken';
import Comment from '../../elements/PostDetail/Comment';
import ContainerComment from '../../elements/PostDetail/ContainerComment';
import Footer from '../../elements/PostDetail/Footer';
import Header from '../../elements/PostDetail/Header';
import Profile from '../../elements/PostDetail/Profile';
import WriteComment from '../../elements/PostDetail/WriteComment';
import {fonts} from '../../utils/fonts';
import {getMyProfile} from '../../service/profile';
import BlockUser from '../../elements/Blocking/BlockUser';
import BlockDomain from '../../elements/Blocking/BlockDomain';
import ReportUser from '../../elements/Blocking/ReportUser';
import ReportDomain from '../../elements/Blocking/ReportDomain';
import SpecificIssue from '../../elements/Blocking/SpecificIssue';
import Toast from 'react-native-simple-toast';

const PostDetailPage = () => {
  const [more, setMore] = useState(10);
  const [totalLine, setTotalLine] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataProfile, setDataProfile] = useState({});
  const refBlockUser = useRef();
  const refBlockDomain = useRef();
  const refReportUser = useRef();
  const refReportDomain = useRef();
  const refSpecificIssue = useRef();

  useEffect(() => {
    fetchMyProfile();
    // refBlockUser.current.open();
    // refBlockDomain.current.open();
    // refReportUser.current.open();
  }, []);
  const onSelectBlocking = (v) => {
    if (v !== 1) {
      // refBlockDomain.current.open();
      refReportUser.current.open();
    }
    refBlockUser.current.close();
  };

  const onNextQuestion = (v) => {
    console.log(v);
    refReportUser.current.close();
    refSpecificIssue.current.open();
  };
  const onIssue = () => {
    refSpecificIssue.current.close();
    Toast.show('Your report was filed & will be investigated', Toast.LONG);
  };
  const fetchMyProfile = async () => {
    let token = await getAccessToken();
    if (token) {
      var decoded = await JWTDecode(token);
      const result = await getMyProfile(decoded.user_id);
      if (result.code === 200) {
        setDataProfile(result.data);
        console.log('detai ', result.data);
        setLoading(false);
      }
      setLoading(false);
    }
  };
  const onTextLayout = (e) => {
    setTotalLine(e.nativeEvent.lines.length);
  };
  const onMore = () => {
    if (more < totalLine) {
      setMore(more + 10);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header onSetting={() => {}} onSearch={() => {}} />
        <Profile />
        <View style={styles.containerText}>
          <Text
            style={styles.textDesc}
            numberOfLines={more}
            onTextLayout={onTextLayout}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae
            diam et tortor rutrum tincidunt vitae non arcu. Pellentesque mattis
            tellus quam, sed porttitor nunc aliquam vitae. Donec id dui lacinia,
            pellentesque ipsum sed, commodo sapien. Praesent tincidunt accumsan
            nibh, id laoreet sapien porta et. Ut aliquet purus sit amet lectus
            fermentum, id consectetur lorem porta. Donec vestibulum lobortis
            ligula, sit amet luctus enim tincidunt non. Nam ultricies lacus ac
            nibh molestie volutpat. Ut aliquet purus sit amet lectus fermentum,
            id consectetur lorem porta. Donec vestibulum lobortis ligula, sit
            amet luctus enim tincidunt non. Nam ultricies lacus ac nibh molestie
            volutpat.
          </Text>
          {more < totalLine && (
            <TouchableOpacity onPress={() => onMore()}>
              <Text style={styles.more}>More</Text>
            </TouchableOpacity>
          )}
        </View>
        <Footer onBlock={() => refBlockUser.current.open()} />
        <ContainerComment />
      </ScrollView>
      <WriteComment />
      <BlockUser
        refBlockUser={refBlockUser}
        onSelect={(v) => onSelectBlocking(v)}
        username="ayaka_kaminari_test"
      />
      <BlockDomain
        refBlockUser={refBlockDomain}
        domain="guardian.com"
        onSelect={() => {}}
      />
      <ReportUser refReportUser={refReportUser} onSelect={onNextQuestion} />
      <ReportDomain refReportDomain={refReportDomain} />
      <SpecificIssue refSpecificIssue={refSpecificIssue} onPress={onIssue} />
    </View>
  );
};

export default PostDetailPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  containerText: {
    marginTop: 20,
    marginHorizontal: 22,
  },
  textDesc: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: '#000',
  },
  more: {
    color: '#0e24b3',
    fontFamily: fonts.inter[400],
    fontSize: 14,
  },
});
