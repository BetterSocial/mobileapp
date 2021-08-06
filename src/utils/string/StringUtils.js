import moment from 'moment';
import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {fonts} from '../fonts';

const NO_POLL_UUID = '00000000-0000-0000-0000-000000000000';

let getPollTime = (pollExpiredAtString) => {
  let currentMoment = moment();
  let pollExpiredMoment = moment(pollExpiredAtString);
  let diff = pollExpiredMoment.diff(currentMoment);

  let diffInDays = pollExpiredMoment.diff(currentMoment, 'days');
  let diffInHours = pollExpiredMoment.diff(currentMoment, 'hours');
  let diffInMinutes = pollExpiredMoment.diff(currentMoment, 'minutes');

  // Poll still continues
  if (diff > 0) {
    if (diffInDays > 0) {
      return `${diffInDays}d left`;
    }
    if (diffInHours > 0) {
      return `${diffInHours}h ${diffInMinutes % 60}m left`;
    } else {
      return `${diffInMinutes % 60}m left`;
    }
  }
  // Poll ended
  else {
    if (diffInDays < 0) {
      return `Poll closed ${Math.abs(diffInDays)}d ago`;
    }
    if (diffInHours > 0) {
      return `Poll closed ${Math.abs(diffInHours)}h ${Math.abs(
        diffInMinutes % 60,
      )}m ago`;
    } else {
      return `Poll closed ${Math.abs(diffInMinutes % 60)}m ago`;
    }
  }
};

let isPollExpired = (pollExpiredAtString) => {
  return moment(pollExpiredAtString).diff(moment()) < 0;
};

let displayFormattedSearchLocations = (searchQuery, locationObject) => {
  // console.log(searchQuery)
  // if (locationObject.country.toLowerCase() === searchQuery.toLowerCase()) {
  //   return <Text style={styles.bold}>{locationObject.country}</Text>;
  // }
  let zipString =
    locationObject.zip === '' || locationObject.zip === undefined
      ? ''
      : `, ${locationObject.zip}`;

  if (locationObject.state.toLowerCase() === searchQuery.toLowerCase()) {
    return (
      <Text>
        {`${locationObject.neighborhood}, ${locationObject.city}, `}
        <Text style={styles.bold}>{locationObject.state}</Text>
        {`, ${locationObject.country}${zipString}`}
      </Text>
    );
  }

  if (locationObject.city.toLowerCase() === searchQuery.toLowerCase()) {
    let zipString =
      locationObject.zip === '' || locationObject.zip === undefined
        ? ''
        : `, ${locationObject.zip}`;
    return (
      <Text>
        {`${locationObject.neighborhood}, `}
        <Text style={styles.bold}>{locationObject.city}</Text>
        {`, ${locationObject.state}, ${locationObject.country}${zipString}`}
      </Text>
    );
  }

  if (locationObject.neighborhood.toLowerCase() === searchQuery.toLowerCase()) {
    return (
      <Text>
        <Text style={styles.bold}>{locationObject.neighborhood}</Text>
        {`, ${locationObject.city} , ${locationObject.state}, ${locationObject.country}${zipString}`}
      </Text>
    );
  }

  if (locationObject.zip.toLowerCase() === searchQuery.toLowerCase()) {
    return (
      <Text>
        {`${locationObject.neighborhood}, ${locationObject.city} , ${locationObject.state}, ${locationObject.country}`}
        <Text style={styles.bold}>{zipString}</Text>
      </Text>
    );
  }

  return (
    <Text>{`${locationObject.neighborhood}, ${locationObject.city}, ${locationObject.state}, ${locationObject.country}`}</Text>
  );
};

let styles = StyleSheet.create({
  bold: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
    // textTransform: 'capitalize',
  },
});

export {
  getPollTime,
  isPollExpired,
  displayFormattedSearchLocations,
  NO_POLL_UUID,
};
