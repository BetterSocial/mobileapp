import React from 'react';
import {
  StatusBar,
  Dimensions,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Image,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import ArrowLeftIcon from '../../assets/icons/images/arrow-left.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const width = Dimensions.get('screen').width;

let dataFollowing = [
  {
    id: 'a',
    username: 'dedesulaiman',
    full_name: 'Dede Sulaiman',
    image_path:
      'https://cdn-2.tstatic.net/papua/foto/bank/images2/kiper-persipura-jayapura-dede-sulaiman-5.jpg',
  },
  {
    id: 'b',
    username: 'agnesmo',
    full_name: 'Agnes Monica',
    image_path:
      'https://www.radarcirebon.com/wp-content/uploads/2018/07/agnes-mo.jpg',
  },
  {
    id: 'c',
    username: 'ariel',
    full_name: 'Ariel',
    image_path:
      'https://cdns.klimg.com/dream.co.id/resized/640x320/news/2020/12/14/154929/pamer-foto-main-ps5-bareng-cewek-ariel-noah-bikin-cemburu-201214q.jpg',
  },
  {
    id: 'd',
    username: 'mak_beti',
    full_name: 'Mak Beti',
    image_path:
      'https://pbs.twimg.com/profile_images/1250756325161578497/Noe2rL6z_400x400.jpg',
  },
  {
    id: 'e',
    username: 'deddy_corbuzier',
    full_name: 'Deddy Corbuzier',
    image_path:
      'https://cdn.akurat.co/images/uploads/images/akurat_20200826023059_56Vw5h.jpg',
  },
  {
    id: 'f',
    username: 'amrilsyaifa',
    full_name: 'Amril Syaifa',
    image_path:
      'https://miro.medium.com/max/3150/1*vkbI1dVtrT-cjMr-z96ySA.jpeg',
  },
  {
    id: 'g',
    username: 'riaricis',
    full_name: 'Ria Ricis',
    image_path:
      'https://asset-a.grid.id/crop/0x0:0x0/360x240/photo/2020/03/30/1010759575.jpg',
  },
  {
    id: 'h',
    username: 'aderai',
    full_name: 'Ade Rai',
    image_path:
      'https://cdns.klimg.com/kapanlagi.com/g/6/_/6_foto_ade_rai_ikuti_event_test_of_will_2019_badannya_atletis_banget/p/ade_rai-20190728-006-daniel.jpg',
  },
  {
    id: 'i',
    username: 'aa_raffi',
    full_name: 'Raffi Ahmad',
    image_path:
      'https://cdns.klimg.com/kapanlagi.com/p/headline/476x238/nggak-tahu-pin-atm-dan-jumlah-kekayaan--d1c15a.jpg',
  },
  {
    id: 'j',
    username: 'bang_atta',
    full_name: 'Atta Halilintar',
    image_path:
      'https://assets.pikiran-rakyat.com/crop/0x0:0x0/x/photo/2021/03/22/328846722.jpg',
  },
];

const Followings = () => {
  const navigation = useNavigation();

  const goToOtherProfile = (data) => {
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
          <Image
            style={styles.imageProfile}
            source={{
              uri: item.image_path,
            }}
          />
          <View style={styles.wrapTextProfile}>
            <Text style={styles.textProfileUsername}>{item.username}</Text>
            <Text style={styles.textProfileFullName}>{item.full_name}</Text>
          </View>
        </View>
        <TouchableNativeFeedback
          onPress={() => {
            console.log('inner press');
          }}>
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
          <Text style={styles.textUsername}>van_darmawan2204</Text>
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
            keyExtractor={(item) => item.id}
          />
        </View>
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
