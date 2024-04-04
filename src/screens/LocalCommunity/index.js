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
import {locationValidation} from '../../utils/Utils';
import {post} from '../../api/server';
import {setLocalCommunity} from '../../context/actions/localCommunity';
import dimen from '../../utils/dimen';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

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
            <PinIcon width={14} height={20} fill={COLORS.white2} />
            <Text style={styles.textLocation}>{locationValidation(item)}</Text>
          </View>
          <TouchableNativeFeedback
            onPress={() => handleDelete(item.location_id)}
            background={TouchableNativeFeedback.Ripple(COLORS.lightgrey, true, 20)}>
            <TrashIcon width={18} height={20} fill={COLORS.white2} />
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
              <PlusIcon
                width={dimen.normalizeDimen(18)}
                height={dimen.normalizeDimen(18)}
                fill={COLORS.white2}
              />
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
              <PlusIcon
                width={dimen.normalizeDimen(18)}
                height={dimen.normalizeDimen(18)}
                fill="#000000"
              />
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
        <View style={styles.textSmallContainer}>
          <Text style={styles.textSmall}>
            We value privacy and do not ask for location tracking access
          </Text>
        </View>
        <Button disabled={location.length < 1} onPress={() => next()}>
          NEXT
        </Button>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  header: {
    paddingHorizontal: dimen.normalizeDimen(22),
    paddingTop: dimen.normalizeDimen(22),
    paddingBottom: dimen.normalizeDimen(5)
  },
  textFindYourLocalCommunity: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(36),
    lineHeight: normalizeFontSize(43.57),
    color: COLORS.white2,
    marginHorizontal: dimen.normalizeDimen(20)
  },
  footer: {
    width,
    height: dimen.normalizeDimen(112),
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    paddingBottom: dimen.normalizeDimen(20),
    paddingHorizontal: dimen.normalizeDimen(20),
    position: 'absolute',
    bottom: 0
  },
  containerProgress: {
    marginTop: dimen.normalizeDimen(20),
    marginBottom: dimen.normalizeDimen(24),
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  textDesc: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    color: COLORS.gray500,
    marginTop: dimen.normalizeDimen(8),
    marginBottom: dimen.normalizeDimen(24),
    paddingHorizontal: dimen.normalizeDimen(20)
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimen.normalizeDimen(22)
  },
  columnButton: {
    flexDirection: 'column',
    marginLeft: dimen.normalizeDimen(14)
  },
  textAddLocation: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    letterSpacing: normalizeFontSize(-0.28),
    marginTop: dimen.normalizeDimen(13),
    color: COLORS.black
  },
  textSearchYourFavorite: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(24),
    letterSpacing: normalizeFontSize(-0.28),
    marginBottom: dimen.normalizeDimen(10),
    color: COLORS.gray500
  },
  containerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dimen.normalizeDimen(22)
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textLocation: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    letterSpacing: normalizeFontSize(-0.28),
    marginVertical: dimen.normalizeDimen(22),
    color: COLORS.black,
    paddingLeft: dimen.normalizeDimen(17)
    // textTransform: 'capitalize',
  },
  textSmallContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textSmall: {
    fontSize: normalizeFontSize(10),
    fontFamily: fonts.inter[400],
    textAlign: 'center',
    color: COLORS.gray500
  }
});
export default LocalCommunity;
