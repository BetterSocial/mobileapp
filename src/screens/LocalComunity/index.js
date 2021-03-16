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
  FlatList,
} from 'react-native';
import MyStatusBar from '../../components/StatusBar';
import {Button} from '../../components/Button';
import {ProgressBar} from '../../components/ProgressBar';
import {SearchModal} from '../../components/Search';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import PlusIcon from '../../../assets/icons/plus.svg';
import PinIcon from '../../../assets/icons/pin.svg';
import TrashIcon from '../../../assets/icons/trash.svg';

const options = [
  {label: 'los angeles', value: 'la'},
  {label: 'new york', value: 'ny'},
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
  const [location, setLocation] = React.useState([]);
  const [searchObjSecond, setSearchObjSecond] = React.useState({});
  const [searchSecond, setSearchSecond] = React.useState('');
  const [optionsSearch, setOptionsSearch] = React.useState([]);
  const [optionsSearchSecond, setOptionsSearchSecond] = React.useState([]);
  const [addSecondLocation, setAddSecondLocation] = React.useState(false);
  const [isVisibleFirstLocation, setIsVisibleFirstLocation] = React.useState(
    false,
  );
  const [isVisibleSecondLocation, setIsVisibleSecondLocation] = React.useState(
    false,
  );

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
      let returnFilter = options.filter((val) =>
        val.label.includes(value.toLowerCase()),
      );
      setOptionsSearch(returnFilter);
      setAddSecondLocation(true);
    } else {
      setAddSecondLocation(false);
      setOptionsSearch([]);
    }
    setSearch(value);
  };

  const handleSearchSecond = (value) => {
    if (value.length > 3) {
      let returnFilter = options.filter((val) =>
        val.label.includes(value.toLowerCase()),
      );
      setOptionsSearchSecond(returnFilter);
    } else {
      setOptionsSearchSecond([]);
    }
    setSearchSecond(value);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSelectedSearch = (val) => {
    let tempLocation = [...location];
    if (tempLocation.length <= 1) {
      tempLocation.push(val);
    }
    setSearch(capitalizeFirstLetter(val.label));
    setOptionsSearch([]);
    setLocation(tempLocation);
  };

  const handleSelectedSearchSecond = (val) => {
    setSearchSecond(capitalizeFirstLetter(val.label));
    setSearchObjSecond(val);
    setOptionsSearchSecond([]);
  };

  const renderItem = ({item}) => (
    <View style={styles.containerLocation}>
      <View style={styles.containerRow}>
        <PinIcon width={14} height={20} fill="#000000" />
        <Text style={styles.textLocation}>{item.label}</Text>
      </View>
      <TouchableNativeFeedback onPress={() => handleDelete(item.value)}>
        <TrashIcon width={18} height={20} fill="#000000" />
      </TouchableNativeFeedback>
    </View>
  );

  const handleDelete = (val) => {
    let tempLocation = [...location];
    let index = tempLocation.findIndex((data) => data.value === val);
    if (index > -1) {
      tempLocation.splice(index, 1);
    }
    setLocation(tempLocation);
  };

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
          <Text style={styles.textDesc}>
            Join up to two cities you call home. Locations can only be adjusted
            or added infrequently.{' '}
          </Text>
          <FlatList
            data={location}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
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
                  <Text style={styles.textAddLocation}>Add New Location</Text>
                  <Text style={styles.textSearchYourFavorite}>
                    Search your favorite location
                  </Text>
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
                    Add a second location
                  </Text>
                  <Text style={styles.textSearchYourFavorite}>
                    🏡 Home away from home? Add a second location
                  </Text>
                </View>
              </View>
            </TouchableNativeFeedback>
          ) : null}
        </View>
        {/* First Location */}
        <SearchModal
          isVisible={isVisibleFirstLocation}
          onClose={() => setIsVisibleFirstLocation(false)}
          value={search}
          onChangeText={(text) => handleSearch(text)}
          placeholder="Search by ZIP, neighborhood or city"
          options={optionsSearch}
          onSelect={(val) => handleSelectedSearch(val)}
        />

        {/* Second Location */}
        <SearchModal
          isVisible={isVisibleSecondLocation}
          onClose={() => setIsVisibleSecondLocation(false)}
          value={search}
          onChangeText={(text) => handleSearch(text)}
          placeholder="Search by ZIP, neighborhood or city"
          options={optionsSearch}
          onSelect={(val) => handleSelectedSearch(val)}
        />

        <View style={styles.footer}>
          <Text style={styles.textSmall}>
          We value privacy and do not ask for 24/7 location tracking
          </Text>
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
    height: 112,
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
    justifyContent: 'space-between',
  },
  containerProgress: {
    marginTop: 36,
    marginBottom: 24,
  },
  textDesc: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 24,
    color: '#828282',
    opacity: 0.84,
    marginTop: 8,
    marginBottom: 25,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#000000',
  },
  textSearchYourFavorite: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 24,
    letterSpacing: -0.28,
    color: '#BDBDBD',
  },
  containerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    marginBottom: 35,
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
    color: '#000000',
    paddingLeft: 17,
    textTransform: 'capitalize',
  },
  textSmall: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 10,
    textAlign: 'center',
    color: '#4F4F4F',
    marginBottom: 10,
    marginTop: 10,
  },
});
export default index;
