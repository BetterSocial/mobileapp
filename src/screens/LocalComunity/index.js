import React, {useContext, useEffect, useState} from 'react';
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
} from 'react-native';
import {post} from '../../api/server';
import {setLocalCommunity} from '../../context/actions/localCommunity';
import MyStatusBar from '../../components/StatusBar';
import {Button} from '../../components/Button';
import {ProgressBar} from '../../components/ProgressBar';
import {SearchModal} from '../../components/Search';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import PlusIcon from '../../../assets/icons/plus.svg';
import PinIcon from '../../../assets/icons/pin.svg';
import TrashIcon from '../../../assets/icons/trash.svg';
import {Context} from '../../context';
import {colors} from '../../utils/colors';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';
import analytics from '@react-native-firebase/analytics';
import StringConstant from '../../utils/string/StringConstant';

const width = Dimensions.get('screen').width;
const LocalComunity = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState([]);
  const [optionsSearch, setOptionsSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleFirstLocation, setIsVisibleFirstLocation] = useState(false);
  const [isVisibleSecondLocation, setIsVisibleSecondLocation] = useState(false);
  const [locationPost, setLocationPost] = useState([]);
  const [locationLog, setLocationLog] = useState([]);

  const [, dispatch] = useContext(Context).localCommunity;
  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'LocalComunity',
      screen_name: 'onb_select_location',
    });
  }, []);

  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <View style={{paddingHorizontal : 22, paddingTop : 22, paddingBottom : 5}}>
        <TouchableNativeFeedback 
          background={TouchableNativeFeedback.Ripple("#AAF", true, 20)}
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableNativeFeedback>
        </View>
      );
    } else {
      return (
        <TouchableHighlight onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableHighlight>
      );
    }
  };

  const handleSearch = (value) => {
    if (value.length >= 3) {
      setIsLoading(true);
      let params = {
        name: value,
      };
      post({url: '/location/list', params})
        .then((res) => {
          setIsLoading(false);
          if (res.status == 200) {
            setOptionsSearch(res.data.body);
          }
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } else {
      setOptionsSearch([]);
    }
    setSearch(value);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSelectedSearch = async (val) => {
    let tempLocation = [...location];
    if (tempLocation.length <= 1) {
      tempLocation.push(val);
    }
    console.log('isi val ', tempLocation);
    setSearch(capitalizeFirstLetter(val.neighborhood));
    setOptionsSearch([]);
    let locLog = [];
    let returnTempLocation = await tempLocation.map((val) => {
      locLog.push({
        location: `${val.city}, ${val.zip}`,
        location_level: val.location_level,
      });
      return val.location_id;
    });
    await setLocation(tempLocation);
    await setLocationPost(returnTempLocation);
    await setLocationLog(locLog);
  };

  const renderItem = ({index, item}) => (
    <TouchableNativeFeedback onPress={() => {
      if(index === 0) return setIsVisibleFirstLocation(true)
      else if(index === 1) return setIsVisibleSecondLocation(true)
    }}>
      <View style={styles.containerLocation}>
        <View style={styles.containerRow}>
          <PinIcon width={14} height={20} fill="#000000" />
          <Text style={styles.textLocation}>{item.neighborhood}</Text>
        </View>
        <TouchableNativeFeedback onPress={() => handleDelete(item.location_id)}>
          <TrashIcon width={18} height={20} fill="#000000" />
        </TouchableNativeFeedback>
      </View>
    </TouchableNativeFeedback>
  );

  const handleDelete = async (val) => {
    let tempLocation = [...location];
    let index = tempLocation.findIndex((data) => data.location_id === val);
    if (index > -1) {
      tempLocation.splice(index, 1);
    }
    let locLog = [];
    let returnTempLocation = await tempLocation.map((val) => {
      locLog.push({
        location: `${val.city}, ${val.zip}`,
        location_level: val.location_level,
      });
      return val.location_id;
    });
    await setLocation(tempLocation);
    await setLocationPost(returnTempLocation);
    await setLocationLog(locLog);
  };
  const next = () => {
    if (location.length > 0) {
      setLocalCommunity(locationPost, dispatch);
      analytics().logEvent('onb_select_location', {
        location: locationLog,
      });
      navigation.navigate('Topics');
    } else {
      showMessage({
        message: 'please add a local community',
        type: 'danger',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.containerProgress}>
        <ProgressBar isStatic={true} value={50} />
      </View>
      <View>
        <Text style={styles.textFindYourLocalComunity}>
          {StringConstant.onboardingLocalCommunityHeadline}
        </Text>
        <Text style={styles.textDesc}>
          {StringConstant.onboardingLocalCommunitySubHeadline}
        </Text>
        <FlatList
          data={location}
          renderItem={renderItem}
          keyExtractor={(item) => item.location_id}
        />

        {/* First Location */}
        {location.length <= 0 ? (
          <TouchableNativeFeedback
            onPress={() => {
              setIsVisibleFirstLocation(true);
              setSearch('');
            }}>
            <View style={styles.card}>
              <PlusIcon width={18} height={18} fill="#000000" />
              <View style={styles.columnButton}>
                <Text style={styles.textAddLocation}>{StringConstant.onboardingLocalCommunityPrimaryLocationTitle}</Text>
                <Text style={styles.textSearchYourFavorite}>{StringConstant.onboardingLocalCommunityPrimaryLocationSubTitle}</Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        ) : null}

        {/* second Location*/}
        {location.length === 1 ? (
          <TouchableNativeFeedback
            onPress={() => {
              setIsVisibleSecondLocation(true);
              setSearch('');
            }}>
            <View style={styles.card}>
              <PlusIcon width={18} height={18} fill="#000000" />
              <View style={styles.columnButton}>
                <Text style={styles.textAddLocation}>
                  {StringConstant.onboardingLocalCommunitySecondaryLocationTitle}
                </Text>
                <Text style={styles.textSearchYourFavorite}>
                  {StringConstant.onboardingLocalCommunitySecondaryLocationSubTitle}
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        ) : null}
      </View>
      {/* First Location */}
      <SearchModal
        isVisible={isVisibleFirstLocation}
        onClose={() => {
          setIsVisibleFirstLocation(false);
          setSearch('');
        }}
        value={search}
        onChangeText={(text) => handleSearch(text)}
        placeholder={StringConstant.searchModalPlaceholder}
        options={optionsSearch}
        onSelect={(val) => {
          setIsVisibleFirstLocation(false);
          setSearch('');
          handleSelectedSearch(val);
        }}
        isLoading={isLoading}
      />

      {/* Second Location */}
      <SearchModal
        isVisible={isVisibleSecondLocation}
        onClose={() => {
          setIsVisibleSecondLocation(false);
          setSearch('');
        }}
        value={search}
        onChangeText={(text) => handleSearch(text)}
        placeholder={StringConstant.searchModalPlaceholder}
        options={optionsSearch}
        onSelect={(val) => {
          setIsVisibleSecondLocation(false);
          setSearch('');
          handleSelectedSearch(val);
        }}
        isLoading={isLoading}
      />

      <View style={styles.footer}>
        <Text style={styles.textSmall}>
          We value privacy and do not ask for location tracking access
        </Text>
        <Button
          disabled={location.length >= 1 ? false : true}
          style={location.length >= 1 ? null : styles.button}
          onPress={() => next()}>
          NEXT
        </Button>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 22,
  },
  textFindYourLocalComunity: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 36,
    lineHeight: 44,
    paddingHorizontal : 22,
    color: colors.bunting,
  },
  containerInfo: {
    marginTop: 55,
    backgroundColor: colors.pattens_blue,
    width: width - 44,
    minHeight: 96,
    flexDirection: 'row',
    // alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'space-between',
    padding: 14,
  },
  widthDescription: {
    width: width - 100,
    marginLeft: 12,
  },
  circleIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: colors.french_pass,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 112,
    width: width,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  containerProgress: {
    marginTop: 36,
    marginBottom: 24,
    paddingHorizontal: 22,
  },
  textDesc: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 24,
    color: colors.gray,
    opacity: 0.84,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal : 22,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal : 22,
    // backgroundColor : 'blue'
  },
  columnButton: {
    flexDirection: 'column',
    marginLeft: 14,
  },
  textAddLocation: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.28,
    marginTop : 13,
    color: colors.black,
  },
  textSearchYourFavorite: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 24,
    letterSpacing: -0.28,
    marginBottom : 10,
    color: colors.silver,
  },
  containerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal : 22,
    // marginBottom: 35,
    // paddingVertical : 0,
    // marginBottom: 20,
    // paddingVertical : 20,
    // backgroundColor : 'red'
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLocation: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.28,
    marginTop : 22,
    marginBottom : 22,
    color: colors.black,
    paddingLeft: 17,
    textTransform: 'capitalize',
  },
  textSmall: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 10,
    textAlign: 'center',
    color: colors.emperor,
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.gray,
  },
});
export default LocalComunity;
