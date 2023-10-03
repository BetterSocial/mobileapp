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
import {Button} from '../../components/Button';
import {Header} from '../../components';
import {ProgressBar} from '../../components/ProgressBar';
import {SearchModal} from '../../components/Search';
import {colors} from '../../utils/colors';
import {locationValidation} from '../../utils/Utils';
import useLocalCommunity from './hooks/useLocalCommunity';

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
            background={TouchableNativeFeedback.Ripple(colors.gray1, true, 20)}>
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
          <TouchableNativeFeedback
            testID="onPressSecondLocation"
            onPress={() => onPressSecondLocation(true)}>
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
