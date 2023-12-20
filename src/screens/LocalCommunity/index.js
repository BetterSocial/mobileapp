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

import PinIcon from '../../../assets/icons/pin.svg';
import PlusIcon from '../../../assets/icons/plus.svg';
import StringConstant from '../../utils/string/StringConstant';
import TrashIcon from '../../../assets/icons/trash.svg';
import dimen from '../../utils/dimen';
import useLocalCommunity from './hooks/useLocalCommunity';
import {Button} from '../../components/Button';
import {Header} from '../../components';
import {ProgressBar} from '../../components/ProgressBar';
import {SearchModal} from '../../components/Search';
import {locationValidation} from '../../utils/Utils';
import {normalizeFontSize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const {width} = Dimensions.get('screen');
const LocalCommunity = () => {
  const {
    search,
    setSearch,
    setIsVisibleSecondLocation,
    isVisibleSecondLocation,
    onPressSecondLocation,
    setIsVisibleFirstLocation,
    isVisibleFirstLocation,
    onPressFirstLocation,
    location,
    onBack,
    handleKeyExtractor,
    optionsSearch,
    isLoading,
    onChangeLocationSearchText,
    handleSelectedSearch,
    handleDelete,
    onPressTouchable,
    next
  } = useLocalCommunity();

  const renderItem = ({index, item}) => {
    return (
      <TouchableNativeFeedback testID="onPressLocation" onPress={() => onPressTouchable(index)}>
        <View style={styles.containerLocation}>
          <View style={styles.containerRow}>
            <PinIcon width={14} height={20} fill="#000000" />
            <Text style={styles.textLocation}>{locationValidation(item)}</Text>
          </View>
          <TouchableNativeFeedback
            testID="deleteLocation"
            onPress={() => handleDelete(item.location_id)}
            background={TouchableNativeFeedback.Ripple(COLORS.gray9, true, 20)}>
            <TrashIcon width={18} height={20} fill="#000000" />
          </TouchableNativeFeedback>
        </View>
      </TouchableNativeFeedback>
    );
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
        <FlatList data={location} renderItem={renderItem} keyExtractor={handleKeyExtractor} />

        {/* First Location */}
        {location.length <= 0 ? (
          <TouchableNativeFeedback
            testID="onPressFirstLocation"
            onPress={() => onPressFirstLocation(true)}>
            <View style={styles.card}>
              <PlusIcon
                width={dimen.normalizeDimen(18)}
                height={dimen.normalizeDimen(18)}
                fill="#000000"
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
          <TouchableNativeFeedback
            testID="onPressSecondLocation"
            onPress={() => onPressSecondLocation(true)}>
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
        <Button
          testID="btn"
          disabled={location.length < 1}
          styles={location.length >= 1 ? null : styles.button}
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
    backgroundColor: COLORS.white
  },
  header: {
    paddingHorizontal: dimen.normalizeDimen(22),
    paddingTop: dimen.normalizeDimen(22),
    paddingBottom: dimen.normalizeDimen(5)
  },
  textFindYourLocalCommunity: {
    fontFamily: 'Inter-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: normalizeFontSize(36),
    lineHeight: normalizeFontSize(43.57),
    color: COLORS.bunting,
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
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    position: 'absolute',
    bottom: 0
  },
  containerProgress: {
    marginTop: dimen.normalizeDimen(20),
    marginBottom: dimen.normalizeDimen(24),
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  textDesc: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    color: COLORS.gray8,
    opacity: 0.84,
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
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    letterSpacing: normalizeFontSize(-0.28),
    marginTop: dimen.normalizeDimen(13),
    color: COLORS.black
  },
  textSearchYourFavorite: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(24),
    letterSpacing: normalizeFontSize(-0.28),
    marginBottom: dimen.normalizeDimen(10),
    color: COLORS.silver
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
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
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
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'Inter',
    textAlign: 'center',
    color: COLORS.blackgrey
  },
  button: {
    backgroundColor: COLORS.gray8,
    borderRadius: dimen.normalizeDimen(8)
  }
});
export default LocalCommunity;
