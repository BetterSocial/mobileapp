import React from 'react';
import {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  Dimensions,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import MyStatusBar from '../../components/StatusBar';
import {Button} from '../../components/Button';
import {ProgressBar} from '../../components/ProgressBar';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import CheckIcon from '../../../assets/icons/check.svg';
import AddIcon from '../../../assets/icons/add.svg';

const width = Dimensions.get('screen').width;

const dataWhoToFollow = [
  {
    group_name: '🇺🇸 american',
    data: [
      {
        id: 1,
        username: '@Bradley_smith',
        full_name: 'Bradley Smith',
        image_path:
          'https://ogletree.com/app/uploads/people/brandon-r-sher-515x560.jpg',
      },
      {
        id: 2,
        username: '@adam_sulaiman',
        full_name: 'Adam Sulaiman',
        image_path:
          'https://i1.rgstatic.net/ii/profile.image/281920379342856-1444226464815_Q512/Adam-Sulaiman.jpg',
      },
      {
        id: 3,
        username: '@naruto',
        full_name: 'Naruto',
        image_path:
          'https://i.pinimg.com/originals/2a/92/06/2a9206a4a0d1d23cf92636c42115d054.jpg',
      },
      {
        id: 4,
        username: '@mike_portnoy',
        full_name: 'Mike Portnoy',
        image_path:
          'https://riftone.my.id/wp-content/uploads/2019/11/Mike_portnoy.jpg',
      },
      {
        id: 5,
        username: '@Synyster_gates',
        full_name: 'Synyster Gates',
        image_path:
          'https://riftone.my.id/wp-content/uploads/2019/11/Mike_portnoy.jpg',
      },
    ],
  },
  {
    group_name: '👴 Joe Biden',
    data: [
      {
        id: 1,
        username: '@Bradley_smith1',
        full_name: 'Bradley Smith',
        image_path:
          'https://ogletree.com/app/uploads/people/brandon-r-sher-515x560.jpg',
      },
      {
        id: 2,
        username: '@adam_sulaiman1',
        full_name: 'Adam Sulaiman',
        image_path:
          'https://i1.rgstatic.net/ii/profile.image/281920379342856-1444226464815_Q512/Adam-Sulaiman.jpg',
      },
      {
        id: 3,
        username: '@naruto1',
        full_name: 'Naruto',
        image_path:
          'https://i.pinimg.com/originals/2a/92/06/2a9206a4a0d1d23cf92636c42115d054.jpg',
      },
      {
        id: 4,
        username: '@mike_portnoy1',
        full_name: 'Mike Portnoy',
        image_path:
          'https://riftone.my.id/wp-content/uploads/2019/11/Mike_portnoy.jpg',
      },
      {
        id: 5,
        username: '@Synyster_gates1',
        full_name: 'Synyster Gates',
        image_path:
          'https://riftone.my.id/wp-content/uploads/2019/11/Mike_portnoy.jpg',
      },
    ],
  },
];
const index = () => {
  const [followed, setFollowed] = useState([]);

  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableHighlight>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableHighlight>
      );
    }
  };

  const handleSelected = (value) => {
    let copyFollowed = [...followed];
    let index = copyFollowed.findIndex((data) => data.username === value.username);
    if (index > -1) {
      copyFollowed.splice(index, 1);
    } else {
      copyFollowed.push(value);
    }

    setFollowed(copyFollowed);
  };

  const renderItem = ({item}) => (
    <View style={styles.containerCard}>
      <View style={styles.cardLeft}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: item.image_path,
          }}
        />
        <View style={styles.containerTextCard}>
          <Text style={styles.textFullName}>{item.full_name}</Text>
          <Text style={styles.textUsername}>{item.username}</Text>
        </View>
      </View>
      <TouchableNativeFeedback onPress={() => handleSelected(item)}>
        <View style={styles.containerButton}>
          {followed.findIndex((data) => data.username === item.username) >
          -1 ? (
            <CheckIcon width={32} height={32} fill="#23C5B6" />
          ) : (
            <AddIcon width={20} height={20} fill="#000000" />
          )}
        </View>
      </TouchableNativeFeedback>
    </View>
  );

  return (
    <>
      <MyStatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapperHeader}>{renderHeader()}</View>
        <View style={styles.containerProgress}>
          <ProgressBar isStatic={true} value={100} />
        </View>
        <View style={styles.content}>
          <Text style={styles.textWhoToFollow}>Who to follow</Text>
          <Text style={styles.textDescription}>
            These make it easy for people to find you
          </Text>
        </View>
        <ScrollView style={{marginBottom: 90}}>
          {dataWhoToFollow.map((value, index) => {
            return (
              <View>
                <View style={styles.headerList}>
                  <Text style={styles.titleHeader}>
                    People in{' '}
                    <Text style={styles.textBold}>{value.group_name}</Text>{' '}
                    follow...
                  </Text>
                </View>
                <FlatList
                  style={styles.flatList}
                  data={value.data}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.footer}>
          <Button>FINISH</Button>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 22,
  },
  wrapperHeader: {
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 22,
  },

  containerProgress: {
    marginTop: 36,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 22,
  },
  textWhoToFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 32,
    lineHeight: 44,
    color: '#11243D',
  },
  textDescription: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 20,
    color: '#828282',
    marginTop: 20,
    opacity: 0.84,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 90,
    width: width,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  containerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 4,
    marginBottom: 8,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRounded: {
    fontFamily: 'Inter-Black',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 24,
    color: '#FFFFFF',
  },
  containerTextCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8,
  },

  button: {
    height: 36,
    backgroundColor: '#11516F',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textStyling: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  textFullName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
    lineHeight: 21,
  },
  textUsername: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#000000',
    lineHeight: 15,
    lineHeight: 17,
  },
  headerList: {
    height: 40,
    paddingLeft: 22,
    paddingRight: 22,
    backgroundColor: '#F2F2F2',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  titleHeader: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 18,
    color: '#4F4F4F',
    textTransform: 'capitalize',
  },
  flatList: {
    paddingLeft: 22,
    paddingRight: 22,
  },
  tinyLogo: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  containerButton: {
    width: 32,
    height: 32,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBold: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 18,
    color: '#4F4F4F',
    textTransform: 'capitalize',
  },
});
export default index;
