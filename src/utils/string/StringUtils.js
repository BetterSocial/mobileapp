/* eslint-disable no-param-reassign,no-useless-escape */
import * as React from 'react';
import moment from 'moment';
import reactStringReplace from 'react-string-replace';
import {StyleSheet, Text} from 'react-native';

import TaggingUserText from '../../components/TaggingUserText';
import TextBold from '../../components/Text/TextBold';
import TopicText from '../../components/TopicText';
// eslint-disable-next-line import/no-cycle
import removePrefixTopic from '../topics/removePrefixTopic';

const NO_POLL_UUID = '00000000-0000-0000-0000-000000000000';

const getPollTime = (pollExpiredAtString, currentMoment = moment()) => {
  const pollExpiredMoment = moment(pollExpiredAtString);
  const diff = pollExpiredMoment.diff(currentMoment);

  const diffInDays = pollExpiredMoment.diff(currentMoment, 'days');
  const diffInHours = pollExpiredMoment.diff(currentMoment, 'hours');
  const diffInMinutes = pollExpiredMoment.diff(currentMoment, 'minutes');

  // Poll still continues
  if (diff > 0) {
    if (diffInDays > 0) {
      return `${diffInDays}d left`;
    }
    if (diffInHours > 0) {
      return `${diffInHours}h ${diffInMinutes % 60}m left`;
    }
    return `${diffInMinutes % 60}m left`;
  }
  // Poll ended

  if (diffInDays < 0) {
    return `Poll closed ${Math.abs(diffInDays)}d ago`;
  }
  if (diffInHours > 0) {
    return `Poll closed ${Math.abs(diffInHours)}h ${Math.abs(diffInMinutes % 60)}m ago`;
  }
  return `Poll closed ${Math.abs(diffInMinutes % 60)}m ago`;
};

const isPollExpired = (pollExpiredAtString) => moment(pollExpiredAtString).diff(moment()) < 0;

/**
 *
 * @param {String} city
 * @param {String} state
 * @returns {String}
 */
const detectStateInCity = (city) => {
  const stateDetectionRegex = /(?:\.)|,/g;
  return city.match(stateDetectionRegex);
};

/**
 *
 * @param {String} city
 * @param {String} state
 * @returns {String}
 */
const displayCityName = (city, state) => {
  if (city === null || city === undefined || city === '') throw new Error('City must be defined');
  if (state === null || state === undefined || state === '')
    throw new Error('State must be defined');
  if (detectStateInCity(city)) return city;

  return `${city}, ${state}`;
};

/**
 *
 * @param {String} searchQuery
 * @param {String} location
 * @returns {Boolean}
 */
const isLocationMatch = (searchQuery, location) =>
  location.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

const displayFormattedSearchLocationsV2 = (searchQuery, locationObject) => {
  const {neighborhood, city, state, country, location_level} = locationObject;

  if (location_level === 'Country') {
    if (isLocationMatch(searchQuery, country))
      return (
        <Text>
          <TextBold text={country} />
        </Text>
      );
    return <Text>{country}</Text>;
  }
  if (location_level === 'State') {
    if (isLocationMatch(searchQuery, state))
      return (
        <Text>
          <TextBold text={`${state}`} />
        </Text>
      );
    return (
      <Text>
        <TextBold text={`${state}`} />
      </Text>
    );
  }

  const cityDisplay = detectStateInCity(city) ? displayCityName(city, state) : city;
  const stateDisplay = detectStateInCity(city) ? '' : `, ${state}`;

  const neighborhoodDisplay = locationObject?.neighborhood
    ? `${locationObject.neighborhood}, `
    : '';

  if (location_level === 'City') {
    if (isLocationMatch(searchQuery, city)) {
      return (
        <Text>
          <TextBold text={cityDisplay} />
          {`${stateDisplay}`}
        </Text>
      );
    }

    return (
      <Text>
        <TextBold text={cityDisplay} />
        {`${stateDisplay}`}
      </Text>
    );
  }

  if (location_level === 'Neighborhood') {
    if (isLocationMatch(searchQuery, neighborhood)) {
      if (isLocationMatch(searchQuery, city)) {
        return (
          <Text>
            <TextBold text={`${neighborhoodDisplay}${cityDisplay}`} />
            {`${stateDisplay}`}
          </Text>
        );
      }

      return (
        <Text>
          <TextBold text={`${neighborhoodDisplay}`} />
          {`${cityDisplay}${stateDisplay}`}
        </Text>
      );
    }

    return (
      <Text>
        {`${neighborhoodDisplay}`}
        <TextBold text={`${cityDisplay}`} />
        {`${stateDisplay}`}
      </Text>
    );
  }

  return null;
};

const getChatName = (usernames, me) => {
  if (!usernames) {
    return 'No Name';
  }

  const userArrays = usernames.split(',');

  if (userArrays.length <= 1) return usernames;
  const userArraysWithoutMe = userArrays.reduce((acc, currentItem) => {
    if (currentItem && currentItem !== '' && currentItem.trim() !== me) {
      acc.push(currentItem.trim());
    }
    return acc;
  }, []);
  if (userArraysWithoutMe.length > 1) {
    return userArraysWithoutMe.join(', ');
  }
  if (userArraysWithoutMe.length === 1) {
    return userArraysWithoutMe[0].trim();
  }
  return 'No name';
};

const getGroupMemberCount = (channel) => Object.keys(channel?.state?.members).length;

const styles = StyleSheet.create({
  bold: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000'
    // textTransform: 'capitalize',
  }
});

const convertString = (str, from, to) => {
  if (str === null || str === undefined) return str;
  return str.split(from).join(to);
};

/**
 *
 * @param {String} topic
 * @returns {String}
 */
const convertTopicNameToTopicPageScreenParam = (topic) => {
  const lowerCaseTopic = topic.toLocaleLowerCase();
  const sanitizeSpaceTopic = lowerCaseTopic.split(' ').join('-');
  return `topic_${sanitizeSpaceTopic}`;
};

const capitalizeFirstText = (str) => {
  // split the above string into an array of strings
  // whenever a blank space is encountered

  const arr = str.split(' ');

  // loop through each element of the array and capitalize the first letter.

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  // Join all the elements of the array back into a string
  // using a blankspace as a separator
  const str2 = arr.join(' ');
  return str2;
};

const randomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 *
 * @param {Number} number
 * @param {String} singularText
 * @param {String} pluralText
 * @returns
 */
const getSingularOrPluralText = (number, singularText, pluralText) => {
  if (number === 1) return singularText;
  return pluralText;
};

/**
 *
 * @param {String} text
 * @param {Any} navigation
 * @returns
 */
const getCaptionWithTopicStyle = (idParams, text, navigation, substringEnd, topics, item) => {
  if (!topics || !Array.isArray(topics)) {
    topics = [];
  }
  const topicWithPrefix = idParams;
  const id = removePrefixTopic(topicWithPrefix);
  const topicRegex = /\B(\#[a-zA-Z0-9_+-]+\b)(?!;)/;
  const validationTextHasAt = /\B(\@[a-zA-Z0-9_+-]+\b)(?!;)/;
  if (substringEnd && typeof substringEnd === 'number') {
    text = text.substring(0, substringEnd);
  }
  substringEnd = Math.round(substringEnd);
  text = reactStringReplace(text, topicRegex, (match) => {
    if (topics?.indexOf(match?.replace('#', '')) > -1)
      return (
        <TopicText
          item={item}
          goToDetailPage={true}
          navigation={navigation}
          text={match}
          currentTopic={id}
        />
      );
    return match;
  });

  text = reactStringReplace(text, validationTextHasAt, (match) => (
    <TaggingUserText
      item={item}
      goToDetailPage={true}
      navigation={navigation}
      text={match}
      currentTopic={id}
    />
  ));
  return text;
};

const removeStringAfterSpace = (str) => str.split(' ')[0];

const sanitizeUrl = (message) => {
  if (message && typeof message === 'string') {
    return message.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim();
  }
  return '';
};

const getHourText = (day, hourParam) => {
  if (day > 0 && hourParam > 0) return `, ${hourParam}h`;
  if (day === 0 && hourParam > 0) return ` ${hourParam}h`;
  return '';
};

const getMinuteText = (minuteParam, hourParam) => {
  if (hourParam > 0 && minuteParam > 0) return `, ${minuteParam}m`;
  if (hourParam === 0 && minuteParam > 0) return ` ${minuteParam}m`;
  return '';
};

const getDurationTimeText = (selectedtime) => {
  const dayText = selectedtime.day > 0 ? `${selectedtime.day} Day(s)` : '';
  const hourText = getHourText(selectedtime?.day, selectedtime?.hour);
  const minuteText = getMinuteText(selectedtime?.minute, selectedtime?.hour);

  return `${dayText}${hourText}${minuteText}`;
};

export {
  capitalizeFirstText,
  convertString,
  convertTopicNameToTopicPageScreenParam,
  displayFormattedSearchLocationsV2,
  getCaptionWithTopicStyle,
  getChatName,
  getGroupMemberCount,
  getPollTime,
  getSingularOrPluralText,
  isPollExpired,
  NO_POLL_UUID,
  randomString,
  removeStringAfterSpace,
  displayCityName,
  sanitizeUrl,
  getDurationTimeText,
  isLocationMatch,
  styles
};
