import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import MyStatusBar from '../../Components/StatusBar';
import {Button} from '../../Components/Button';
import {ProgressBar} from '../../Components/ProgressBar';
import {SearchAutoComplete} from '../../Components/Search';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import WarningCircleBlueIcon from '../../../assets/icons/warning-circle-blue.svg';

const options = [
  {label: 'medan', value: 'mdn'},
  {label: 'jakarta', value: 'jkt'},
  {label: 'bandung', value: 'bdg'},
  {label: 'surabaya', value: 'sby'},
  {label: 'jaya pura', value: 'jpr'},
  {label: 'bogor', value: 'bgr'},
  {label: 'malang', value: 'mlg'},
];

const width = Dimensions.get('screen').width;
const index = () => {
  const [search, setSearch] = React.useState('');
  const [searchObj, setSearchObj] = React.useState({});
  const [searchObjSecond, setSearchObjSecond] = React.useState({});
  const [searchSecond, setSearchSecond] = React.useState('');
  const [optionsSearch, setOptionsSearch] = React.useState([]);
  const [optionsSearchSecond, setOptionsSearchSecond] = React.useState([]);
  const [addSecondLocation, setAddSecondLocation] = React.useState(false);
  const [inputSecondLocation, setInputSecondLocation] = React.useState(false);

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

  const handleSearch = (value) => {
    if (value.length > 3) {
      let returnFilter = options.filter(val => val.label.includes(value.toLowerCase()))
      setOptionsSearch(returnFilter)
      setAddSecondLocation(true);
    } else {
      setAddSecondLocation(false);
      setOptionsSearch([])
    }
    setSearch(value);
  };

  const handleSearchSecond = (value) => {
    if (value.length > 3) {
      let returnFilter = options.filter(val => val.label.includes(value.toLowerCase()))
      setOptionsSearchSecond(returnFilter)
    } else {
      setOptionsSearchSecond([])
    }
    setSearchSecond(value);
  };

  

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleSelectedSearch = (val) => {
    setSearch(capitalizeFirstLetter(val.label))
    setSearchObj(val)
    setOptionsSearch([])
  }

  const handleSelectedSearchSecond =  (val) => {
    setSearchSecond(capitalizeFirstLetter(val.label))
    setSearchObjSecond(val)
    setOptionsSearchSecond([])
  }
  return (
    <>
      <MyStatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.containerProgress}>
          <ProgressBar isStatic={true} value={50} />
        </View>
        <View>
          <Text style={styles.textFindYourLocalComunity}>
            Find your local community
          </Text>
          <View style={styles.containerSearch}>
            <SearchAutoComplete
              iconName="search"
              iconColor="#000000"
              value={search}
              onChangeText={(text) => handleSearch(text)}
              placeholder="Search by ZIP, neighborhood or city"
              options={optionsSearch}
              onSelect={(val) => handleSelectedSearch(val)}
            />
          </View>

          {inputSecondLocation ? (
            <View style={styles.containerSearchSecond}>
              <SearchAutoComplete
                iconName="search"
                iconColor="#000000"
                value={searchSecond}
                onChangeText={(text) => handleSearchSecond(text)}
                placeholder="Search Second Location by ZIP, neighborhood or city"
                options={optionsSearchSecond}
                onSelect={(val) => handleSelectedSearchSecond(val)}
              />
            </View>
          ) : null}

          {(addSecondLocation && !inputSecondLocation) ? (
            <TouchableNativeFeedback onPress={() => setInputSecondLocation(!inputSecondLocation)}>
              <View style={styles.containerDescription}>
                <Text style={(styles.textDescription, {marginRight: 3})}>
                  (+)
                </Text>
                <Text style={styles.textDescription}>
                  Home away from home? Add a second location
                </Text>
              </View>
            </TouchableNativeFeedback>
          ) : null}

          <View style={styles.containerInfo}>
            <Text>
              <WarningCircleBlueIcon width={20} height={20} fill="#55C2FF" />
              <Text style={styles.textLocations}>
                We never track your location! But we want to make you feel home.
                Locations can only be adjusted or added infrequently. Time for
                some reckoning - where is home? 🤔
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Button>NEXT</Button>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },
  textFindYourLocalComunity: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 36,
    lineHeight: 44,
    color: '#11243D',
  },
  containerDescription: {
    width: width - 44,
    height: 33,
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 1,
    elevation: 1,
  },
  textDescription: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '900',
    fontSize: 14,
    color: '#000000',
  },
  containerInfo: {
    marginTop: 55,
    backgroundColor: '#ddf2fe',
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
  textLocations: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    color: '#258FCB',
    lineHeight: 24,
    paddingLeft: 10,
  },
  circleIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#b6e4fd',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  containerProgress: {
    marginTop: 36,
    marginBottom: 24,
  },
  containerSearch: {
    marginTop: 28,
    marginBottom: 18,
  },
  containerSearchSecond: {
    marginBottom: 18,
  },
});
export default index;
