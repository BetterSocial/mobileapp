import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {debounce} from 'lodash';
import {showMessage} from 'react-native-flash-message';

import {post} from '../../../api/server';
import {setLocalCommunity} from '../../../context/actions/localCommunity';
import {Context} from '../../../context';
import {Analytics} from '../../../libraries/analytics/firebaseAnalytics';

const useLocalCommunity = () => {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');
  const [isVisibleSecondLocation, setIsVisibleSecondLocation] = React.useState(false);
  const [isVisibleFirstLocation, setIsVisibleFirstLocation] = React.useState(false);
  const [locationPost, setLocationPost] = React.useState([]);
  const [location, setLocation] = React.useState([]);
  const [optionsSearch, setOptionsSearch] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [locationLog, setLocationLog] = React.useState([]);
  const [, dispatch] = React.useContext(Context).localCommunity;

  const handleKeyExtractor = (item, index) => {
    return index.toString();
  };

  const onPressSecondLocation = (status) => {
    setIsVisibleSecondLocation(status);
    setSearch('');
  };

  const onPressFirstLocation = (status) => {
    setIsVisibleFirstLocation(status);
    setSearch('');
  };

  const onBack = () => {
    navigation.goBack();
  };

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

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
    const returnTempLocation = tempLocation.map((item) => {
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

  const handleDelete = async (val) => {
    const tempLocation = [...location];
    const index = tempLocation.findIndex((data) => data.location_id === val);
    if (index > -1) {
      tempLocation.splice(index, 1);
    }
    const locLog = [];
    const returnTempLocation = tempLocation.map((item) => {
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

  const onPressTouchable = (index) => {
    setSearch('');
    if (index === 0) {
      setIsVisibleFirstLocation(true);
    } else if (index === 1) {
      setIsVisibleSecondLocation(true);
    }
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

  return {
    handleKeyExtractor,
    setSearch,
    search,
    isVisibleSecondLocation,
    setIsVisibleSecondLocation,
    onPressSecondLocation,
    isVisibleFirstLocation,
    setIsVisibleFirstLocation,
    onPressFirstLocation,
    location,
    setLocation,
    onBack,
    locationPost,
    setLocationPost,
    optionsSearch,
    setOptionsSearch,
    isLoading,
    setIsLoading,
    locationLog,
    setLocationLog,
    capitalizeFirstLetter,
    handleSearch,
    onChangeLocationSearchText,
    handleSelectedSearch,
    handleDelete,
    onPressTouchable,
    next
  };
};

export default useLocalCommunity;
