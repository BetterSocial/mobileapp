import React from 'react';
import {useEffect, useState} from 'react';
import {
  StatusBar,
  Dimensions,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  FlatList,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import MemoIc_btn_add from '../../assets/icons/Ic_btn_add';
import Loading from '../Loading';
import {getFollowing} from '../../service/profile';
import {useNavigation} from '@react-navigation/core';
import ArrowLeftIcon from '../../assets/icons/images/arrow-left.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const width = Dimensions.get('screen').width;

const Followings = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [user_id, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataFollowing, setDataFollowing] = useState([]);

  const {params} = route;

  useEffect(() => {
    setUserId(params.user_id);
    setUsername(params.username);
    fetchFollowing(true);
  }, [params.user_id]);

  const fetchFollowing = async (withLoading) => {
    withLoading ? setIsLoading(true) : null;
    const result = await getFollowing('288d5679-6c68-41ec-be83-7f15a4e82d3d');
    if (result.code == 200) {
      withLoading ? setIsLoading(false) : null;
      setDataFollowing(result.data);
    }
  };

  const goToOtherProfile = (value) => {
    let data = {
      user_id,
      other_id: value.user_id_followed,
      username,
    };
    navigation.navigate('OtherProfile', {data});
  };

  const renderItem = ({item}) => (
    <TouchableNativeFeedback
      onPress={(event) => {
        event.preventDefault();
        goToOtherProfile(item);
      }}>
      <View style={styles.card}>
        <View style={styles.wrapProfile}>
          <MemoIc_btn_add width={48} height={48} />
          <View style={styles.wrapTextProfile}>
            <Text style={styles.textProfileUsername}>{item.user.username}</Text>
            <Text style={styles.textProfileFullName}>
              {item.user.real_name ? item.user.real_name : 'no name specifics'}
            </Text>
          </View>
        </View>
        <TouchableNativeFeedback>
          <View style={styles.buttonFollowing}>
            <Text style={styles.textButtonFollowing}>Following</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </TouchableNativeFeedback>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.floatLeft}>
            <TouchableNativeFeedback onPress={() => navigation.goBack()}>
              <ArrowLeftIcon width={20} height={12} fill="#000" />
            </TouchableNativeFeedback>
          </View>
          <Text style={styles.textUsername}>{username}</Text>
        </View>
        <View style={styles.tabs}>
          <View style={styles.wrapTextTabs}>
            <Text style={styles.textTabs}>
              Following ({dataFollowing.length})
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <FlatList
            data={dataFollowing}
            renderItem={renderItem}
            keyExtractor={(item) => item.follow_action_id}
          />
        </View>
        <Loading visible={isLoading} />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    paddingBottom: 16,
    paddingTop: 16,
    position: 'relative',
  },
  textUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.black,
  },
  floatLeft: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  tabs: {
    width: width,
    borderBottomColor: colors.alto,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginTop: 14,
  },
  wrapTextTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderBottomWidth: 2,
    borderBottomColor: colors.bondi_blue,
  },
  textTabs: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  content: {
    padding: 20,
    flexDirection: 'column',
    paddingBottom: 150,
  },
  card: {
    height: 68,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageProfile: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  wrapTextProfile: {
    marginLeft: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  textProfileUsername: {
    fontFamily: fonts.inter[500],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  textProfileFullName: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
  },
  buttonFollowing: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8,
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue,
  },
});
export default Followings;
