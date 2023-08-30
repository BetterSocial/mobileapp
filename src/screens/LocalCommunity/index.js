import * as React from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import {debounce} from 'lodash';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';

import PinIcon from '../../../assets/icons/pin.svg';
import PlusIcon from '../../../assets/icons/plus.svg';
import StringConstant from '../../utils/string/StringConstant';
import TrashIcon from '../../../assets/icons/trash.svg';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';
import {Button} from '../../components/Button';
import {Context} from '../../context';
import {Header} from '../../components';
import {ProgressBar} from '../../components/ProgressBar';
import {SearchModal} from '../../components/Search';
import {colors} from '../../utils/colors';
import {locationValidation} from '../../utils/Utils';
import {post} from '../../api/server';
import {setLocalCommunity} from '../../context/actions/localCommunity';

const {width} = Dimensions.get('screen');
const LocalCommunity = () => {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');
  const [location, setLocation] = React.useState([]);
  const [optionsSearch, setOptionsSearch] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isVisibleFirstLocation, setIsVisibleFirstLocation] = React.useState(false);
  const [isVisibleSecondLocation, setIsVisibleSecondLocation] = React.useState(false);
  const [locationPost, setLocationPost] = React.useState([]);
  const [locationLog, setLocationLog] = React.useState([]);

  const [, dispatch] = React.useContext(Context).localCommunity;

  const handleSearch = (value) => {
    const params = {
      name: value
    };

    post({url: '/location/list_v2', params})
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200) {
          setOptionsSearch(res.data.body);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const doOnLocationSearchTextDebounce = React.useCallback(debounce(handleSearch, 500), []);

  const onChangeLocationSearchText = (text) => {
    if (text.length >= 3) {
      doOnLocationSearchTextDebounce(text);
      setOptionsSearch([]);
      setIsLoading(true);
    } else {
      setIsLoading(false);
      doOnLocationSearchTextDebounce.cancel();
      setOptionsSearch([]);
    }

    setSearch(text);
  };

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const handleSelectedSearch = async (val, index) => {
    const tempLocation = [...location];
    if (tempLocation.length <= 1) {
      tempLocation.push(val);
    } else {
      tempLocation[index] = val;
    }
    setSearch(capitalizeFirstLetter(val.neighborhood));
    setOptionsSearch([]);
    const locLog = [];
    const returnTempLocation = await tempLocation.map((item) => {
      locLog.push({
        location: `${item.city}, ${item.zip}`,
        location_level: item.location_level
      });
      return item.location_id;
    });
    await setLocation(tempLocation);
    await setLocationPost(returnTempLocation);
    await setLocationLog(locLog);
  };

  const renderItem = ({index, item}) => {
    const onPressTouchable = () => {
      setSearch('');
      if (index === 0) {
        setIsVisibleFirstLocation(true);
      } else if (index === 1) {
        setIsVisibleSecondLocation(true);
      }
    };

    return (
      <TouchableNativeFeedback onPress={onPressTouchable}>
        <View style={styles.containerLocation}>
          <View style={styles.containerRow}>
            <PinIcon width={14} height={20} fill="#000000" />
            <Text style={styles.textLocation}>{locationValidation(item)}</Text>
          </View>
          <TouchableNativeFeedback
            onPress={() => handleDelete(item.location_id)}
            background={TouchableNativeFeedback.Ripple(colors.gray1, true, 20)}>
            <TrashIcon width={18} height={20} fill="#000000" />
          </TouchableNativeFeedback>
        </View>
      </TouchableNativeFeedback>
    );
  };

  const handleDelete = async (val) => {
    const tempLocation = [...location];
    const index = tempLocation.findIndex((data) => data.location_id === val);
    if (index > -1) {
      tempLocation.splice(index, 1);
    }
    const locLog = [];
    const returnTempLocation = await tempLocation.map((item) => {
      locLog.push({
        location: `${item.city}, ${item.zip}`,
        location_level: item.location_level
      });
      return item.location_id;
    });
    await setLocation(tempLocation);
    await setLocationPost(returnTempLocation);
    await setLocationLog(locLog);
  };
  const next = () => {
    if (location.length > 0) {
      setLocalCommunity(locationPost, dispatch);
      Analytics.logEvent('onb_select_location', {
        location: locationLog
      });
      navigation.navigate('Topics');
    } else {
      showMessage({
        message: 'please add a local community',
        type: 'danger'
      });
    }
  };

  const onPressFirstLocation = (status) => {
    setIsVisibleFirstLocation(status);
    setSearch('');
  };

  const onPressSecondLocation = (status) => {
    setIsVisibleSecondLocation(status);
    setSearch('');
  };

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onPress={onBack} />
      {/* {renderHeader()} */}
      <View style={styles.containerProgress}>
        <ProgressBar isStatic={true} value={50} />
      </View>
      <View>
        <Text style={styles.textFindYourLocalCommunity}>
          {StringConstant.onboardingLocalCommunityHeadline}
        </Text>
        <Text style={styles.textDesc}>{StringConstant.onboardingLocalCommunitySubHeadline}</Text>
        <FlatList
          data={location}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* First Location */}
        {location.length <= 0 ? (
          <TouchableNativeFeedback onPress={() => onPressFirstLocation(true)}>
            <View style={styles.card}>
              <PlusIcon width={18} height={18} fill="#000000" />
              <View style={styles.columnButton}>
                <Text style={styles.textAddLocation}>
                  {StringConstant.onboardingLocalCommunityPrimaryLocationTitle}
                </Text>
                <Text style={styles.textSearchYourFavorite}>
                  {StringConstant.onboardingLocalCommunityPrimaryLocationSubTitle}
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        ) : null}

        {/* second Location */}
        {location.length === 1 ? (
          <TouchableNativeFeedback onPress={() => onPressSecondLocation(true)}>
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
        onClose={() => onPressFirstLocation(false)}
        value={search}
        onChangeText={(text) => onChangeLocationSearchText(text)}
        placeholder={StringConstant.searchModalPlaceholder}
        options={optionsSearch}
        onSelect={(val) => {
          setIsVisibleFirstLocation(false);
          setSearch('');
          handleSelectedSearch(val, 0);
        }}
        isLoading={isLoading}
      />

      {/* Second Location */}
      <SearchModal
        isVisible={isVisibleSecondLocation}
        onClose={() => onPressSecondLocation(false)}
        value={search}
        onChangeText={(text) => onChangeLocationSearchText(text)}
        placeholder={StringConstant.searchModalPlaceholder}
        options={optionsSearch}
        onSelect={(val) => {
          setIsVisibleSecondLocation(false);
          setSearch('');
          handleSelectedSearch(val, 1);
        }}
        isLoading={isLoading}
      />

      <View style={styles.footer}>
        <Text style={styles.textSmall}>
          We value privacy and do not ask for location tracking access
        </Text>
        <Button
          disabled={location.length < 1}
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
    backgroundColor: colors.white
  },
  header: {paddingHorizontal: 22, paddingTop: 22, paddingBottom: 5},
  textFindYourLocalCommunity: {
    fontFamily: 'Inter-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 36,
    lineHeight: 43.57,
    color: '#11243D',
    marginHorizontal: 20
  },
  containerInfo: {
    marginTop: 55,
    backgroundColor: colors.pattens_blue,
    width: width - 44,
    minHeight: 96,
    flexDirection: 'row',
    borderRadius: 4,
    justifyContent: 'space-between',
    padding: 14
  },
  widthDescription: {
    width: width - 100,
    marginLeft: 12
  },
  circleIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: colors.french_pass,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 112,
    width,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  containerProgress: {
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20
  },
  textDesc: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
    color: colors.gray,
    opacity: 0.84,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 20
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22
  },
  columnButton: {
    flexDirection: 'column',
    marginLeft: 14
  },
  textAddLocation: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.28,
    marginTop: 13,
    color: colors.black
  },
  textSearchYourFavorite: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 24,
    letterSpacing: -0.28,
    marginBottom: 10,
    color: colors.silver
  },
  containerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textLocation: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.28,
    marginTop: 22,
    marginBottom: 22,
    color: colors.black,
    paddingLeft: 17
    // textTransform: 'capitalize',
  },
  textSmall: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    textAlign: 'center',
    color: colors.blackgrey,
    marginBottom: 10,
    marginTop: 12
  },
  button: {
    backgroundColor: colors.gray
  }
});
export default LocalCommunity;
