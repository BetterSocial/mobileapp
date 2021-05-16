import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import JWTDecode from 'jwt-decode';
import {getAccessToken} from '../../data/local/accessToken';
import Comment from '../../elements/PostDetail/Comment';
import ContainerComment from '../../elements/PostDetail/ContainerComment';
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
import Header from '../feedScreen/Header';
import Content from '../feedScreen/Content';
import Footer from '../feedScreen/Footer';
import Gap from '../../components/Gap';

const {width, height} = Dimensions.get('window');

const PostDetailPage = (props) => {
  const [more, setMore] = useState(10);
  const [totalLine, setTotalLine] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataProfile, setDataProfile] = useState({});
  const refBlockUser = useRef();
  const refBlockDomain = useRef();
  const refReportUser = useRef();
  const refReportDomain = useRef();
  const refSpecificIssue = useRef();
  const [item, setItem] = useState(props.route.params.item);

  useEffect(() => {
    const initial = () => {
      console.log(props.route.params.item.id);
    };
    initial();
  }, [props]);

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{height: height * 0.9}}>
        <View style={styles.content}>
          <Header props={item} isBackButton={true} />
          <Content
            message={item.message}
            images_url={item.images_url}
            style={item.images_url.length > 0 ? {height: height * 0.5} : null}
          />
          <Gap style={{height: 16}} />
          <Footer />
        </View>

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
  content: {
    width: width,
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
