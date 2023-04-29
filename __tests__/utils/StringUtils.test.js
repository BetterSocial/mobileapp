import {
  getPollTime,
  isPollExpired,
  displayCityName,
  isLocationMatch,
  getChatName,
  getGroupMemberCount,
  convertString,
  convertTopicNameToTopicPageScreenParam,
  capitalizeFirstText,
  removeStringAfterSpace,
  sanitizeUrl,
  getHourText,
  getMinuteText,
  getDurationTimeText,
  getSingularOrPluralText
} from '../../src/utils/string/StringUtils';
import moment from 'moment';
describe('SringUtils should be run corret', () => {
  it('getPollTime  should run correctly', () => {
    const hours = moment().add('hour', 2);
    const days = moment().add('day', 2);
    const expiredHourse = moment().subtract('hours', 2);
    const expiredDays = moment().subtract('day', 2);
    const minute = moment().add(40, 'minute')
    expect(getPollTime(hours)).toEqual('1h 59m left');
    expect(getPollTime(days)).toEqual('1d left');
    expect(getPollTime(expiredDays)).toEqual('Poll closed 2d ago');
    expect(getPollTime(expiredHourse)).toEqual('Poll closed 0m ago');
    expect(getPollTime(minute)).toEqual('39m left')
  });

  it('isPollExpired should run correctly', () => {
    const expiredDate = moment().subtract('day', 1);
    const notExpired = moment().add('day', 2);
    expect(isPollExpired(expiredDate)).toBeTruthy();
    expect(isPollExpired(notExpired)).toBeFalsy();
  });

  it('displayCityName should run correctly', () => {
    const city1 = 'Jakarta';
    const starte = 'Jakarta Barat';
    expect(displayCityName(city1, starte)).toEqual('Jakarta, Jakarta Barat');
  });

  it('isLocationMatch should run correctly', () => {
    expect(isLocationMatch('yogyakarta', 'yogyakarta, indonesia')).toBeTruthy();
    expect(isLocationMatch('yogyakarta', 'medan, indonesia')).toBeFalsy();
  });

  it('getChatName should run correctly', () => {
    const username = 'agita';
    const username2 = 'agita, elon musk, steve jobs';
    const username3 = 'elon musk, steve jobs';
    const username4 = 'agita, elon';
    const username5 = '';
    expect(getChatName(null, null)).toEqual('No Name');
    expect(getChatName(username)).toEqual('agita');
    expect(getChatName(username2, 'agita')).toEqual('elon musk, steve jobs');
    expect(getChatName(username3)).toEqual('elon musk, steve jobs');
    expect(getChatName(username4, 'agita')).toEqual('elon');
    expect(getChatName(username5, 'agita')).toEqual('No Name');
    expect(getChatName('', '')).toEqual('No Name');
  });

  it('getGroupMemberCount should run correctly', () => {
    const channel = {
      state: {
        members: [{name: 'agite'}, {name: 'fajarism'}]
      }
    };
    expect(getGroupMemberCount(channel)).toEqual(2);
  });
  it('convertString should run correctly', () => {
    expect(convertString('nama saya, agita', ',', '')).toEqual('nama saya agita');
    expect(convertString(null, ',', '')).toEqual(null);
  });

  it('convertTopicNameToTopicPageScreenParam should run correctly', () => {
    const topic = 'Sepakbola Italia';
    expect(convertTopicNameToTopicPageScreenParam(topic)).toEqual('topic_sepakbola-italia');
  });

  it('capitalizeFirstText should run correctly', () => {
    expect(capitalizeFirstText('nama saya agita')).toEqual('Nama Saya Agita');
  });

  it('removeStringAfterSpace should run correctly', () => {
    expect(removeStringAfterSpace('halo nama saya')).toEqual('halo');
  });

  it('sanitizeUrl should run correctly', () => {
    expect(sanitizeUrl('nama saya agita https://datik.com')).toEqual('nama saya agita');
    expect(sanitizeUrl(null)).toEqual('');
  });

  it('getHourText should run correctly', () => {
    expect(getHourText(1, 1)).toEqual(', 1h');
    expect(getHourText(0, 1)).toEqual(' 1h');
    expect(getHourText(-1, 0)).toEqual('');
  });

  it('getMinuteText should run correctly', () => {
    expect(getMinuteText(1, 1)).toEqual(', 1m');
    expect(getMinuteText(0, 1)).toEqual('');
    expect(getMinuteText(-1, 0)).toEqual('');
  });

  it('getDurationTimeText should run correctly', () => {
    expect(getDurationTimeText({day: 1})).toEqual('1 Day(s)');
    expect(getDurationTimeText({day: 1})).toEqual('1 Day(s)');
    expect(getDurationTimeText({day: 2})).toEqual('2 Day(s)');
  });

  it('getSingularOrPluralText should run correctly', () => {
    expect(getSingularOrPluralText(1, 'message', 'messages')).toEqual('message');
    expect(getSingularOrPluralText(2, 'message', 'messages')).toEqual('messages');
  });
});

// const getPollTime = (pollExpiredAtString) => {
//   const currentMoment = moment();
//   const pollExpiredMoment = moment(pollExpiredAtString);
//   const diff = pollExpiredMoment.diff(currentMoment);

//   const diffInDays = pollExpiredMoment.diff(currentMoment, 'days');
//   const diffInHours = pollExpiredMoment.diff(currentMoment, 'hours');
//   const diffInMinutes = pollExpiredMoment.diff(currentMoment, 'minutes');

//   // Poll still continues
//   if (diff > 0) {
//     if (diffInDays > 0) {
//       return `${diffInDays}d left`;
//     }
//     if (diffInHours > 0) {
//       return `${diffInHours}h ${diffInMinutes % 60}m left`;
//     }
//     return `${diffInMinutes % 60}m left`;
//   }
//   // Poll ended

//   if (diffInDays < 0) {
//     return `Poll closed ${Math.abs(diffInDays)}d ago`;
//   }
//   if (diffInHours > 0) {
//     return `Poll closed ${Math.abs(diffInHours)}h ${Math.abs(diffInMinutes % 60)}m ago`;
//   }
//   return `Poll closed ${Math.abs(diffInMinutes % 60)}m ago`;
// };

// const isPollExpired = (pollExpiredAtString) => moment(pollExpiredAtString).diff(moment()) < 0;

// /**
//  *
//  * @param {String} city
//  * @param {String} state
//  * @returns {String}
//  */
// const detectStateInCity = (city) => {
//   const stateDetectionRegex = /(?:\.)|,/g;
//   return city.match(stateDetectionRegex);
// };

// /**
//  *
//  * @param {String} city
//  * @param {String} state
//  * @returns {String}
//  */
// const displayCityName = (city, state) => {
//   if (city === null || city === undefined || city === '') throw new Error('City must be defined');
//   if (state === null || state === undefined || state === '')
//     throw new Error('State must be defined');
//   if (detectStateInCity(city)) return city;

//   return `${city}, ${state}`;
// };

// /**
//  *
//  * @param {String} searchQuery
//  * @param {String} location
//  * @returns {Boolean}
//  */
// const isLocationMatch = (searchQuery, location) =>
//   location.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

// const displayFormattedSearchLocations = (searchQuery, locationObject) => {
//   const zipString =
//     locationObject.zip === '' || locationObject.zip === undefined ? '' : `, ${locationObject.zip}`;

//   // if (locationObject.state.toLowerCase() === searchQuery.toLowerCase()) {
//   //     const neighborhood = locationObject?.neighborhood ? `${locationObject.neighborhood}, ` : ``
//   //     return (
//   //         <Text>
//   //             {`${neighborhood}${locationObject.city}, `}
//   //             <Text style={styles.bold}>{locationObject.state}</Text>
//   //             {`, ${locationObject.country}${zipString}`}
//   //         </Text>
//   //     );
//   // }

//   if (
//     locationObject.city.toLowerCase() === searchQuery.toLowerCase() ||
//     locationObject.state.toLowerCase() === searchQuery.toLowerCase()
//   ) {
//     const {city, state} = locationObject;

//     const cityDisplay = detectStateInCity(city) ? displayCityName(city, state) : city;
//     const stateDisplay = detectStateInCity(city) ? ',' : `, ${state},`;

//     const neighborhood = locationObject?.neighborhood ? `${locationObject.neighborhood}, ` : '';
//     return (
//       <Text>
//         {`${neighborhood}`}
//         <Text style={styles.bold}>{cityDisplay}</Text>
//         {`${stateDisplay} ${locationObject.country}${zipString}`}
//       </Text>
//     );
//   }

//   if (locationObject.neighborhood.toLowerCase() === searchQuery.toLowerCase()) {
//     const cityState = displayCityName(locationObject?.city, locationObject?.state);
//     return (
//       <Text>
//         <Text style={styles.bold}>{locationObject.neighborhood}</Text>
//         {`, ${cityState}, ${locationObject.country}${zipString}`}
//       </Text>
//     );
//   }

//   if (locationObject.zip.toLowerCase() === searchQuery.toLowerCase()) {
//     return (
//       <Text>
//         {`${locationObject.neighborhood}, ${locationObject.city} , ${locationObject.state}, ${locationObject.country}`}
//         <Text style={styles.bold}>{zipString}</Text>
//       </Text>
//     );
//   }

//   if (locationObject.location_level === 'Country') {
//     return <Text>{`${locationObject.country}${zipString}`}</Text>;
//   }

//   if (locationObject.location_level === 'State') {
//     return <Text>{`${locationObject.state}, ${locationObject.country}${zipString}`}</Text>;
//   }

//   const cityState = displayCityName(locationObject?.city, locationObject?.state);
//   if (locationObject.location_level === 'City') {
//     // return <Text>{`${locationObject.city} , ${locationObject.state}, ${locationObject.country}${zipString}`}</Text>
//     return <Text>{`${cityState}, ${locationObject.country}${zipString}`}</Text>;
//   }

//   if (!locationObject.neighborhood) {
//     return <Text>{`${cityState}, ${locationObject.country}${zipString}`}</Text>;
//   }

//   return <Text>{`${locationObject.neighborhood}, ${cityState}, ${locationObject.country}`}</Text>;
// };

// const displayFormattedSearchLocationsV2 = (searchQuery, locationObject) => {
//   const {neighborhood, city, state, country, location_level} = locationObject;

//   if (location_level === 'Country') {
//     if (isLocationMatch(searchQuery, country))
//       return (
//         <Text>
//           <TextBold text={country} />
//         </Text>
//       );
//     return <Text>{country}</Text>;
//   }
//   if (location_level === 'State') {
//     if (isLocationMatch(searchQuery, state))
//       return (
//         <Text>
//           <TextBold text={`${state}`} />
//         </Text>
//       );
//     return (
//       <Text>
//         <TextBold text={`${state}`} />
//       </Text>
//     );
//   }

//   const cityDisplay = detectStateInCity(city) ? displayCityName(city, state) : city;
//   const stateDisplay = detectStateInCity(city) ? '' : `, ${state}`;

//   const neighborhoodDisplay = locationObject?.neighborhood
//     ? `${locationObject.neighborhood}, `
//     : '';

//   if (location_level === 'City') {
//     if (isLocationMatch(searchQuery, city)) {
//       return (
//         <Text>
//           <TextBold text={cityDisplay} />
//           {`${stateDisplay}`}
//         </Text>
//       );
//     }

//     return (
//       <Text>
//         <TextBold text={cityDisplay} />
//         {`${stateDisplay}`}
//       </Text>
//     );
//   }

//   if (location_level === 'Neighborhood') {
//     if (isLocationMatch(searchQuery, neighborhood)) {
//       if (isLocationMatch(searchQuery, city)) {
//         return (
//           <Text>
//             <TextBold text={`${neighborhoodDisplay}${cityDisplay}`} />
//             {`${stateDisplay}`}
//           </Text>
//         );
//       }

//       return (
//         <Text>
//           <TextBold text={`${neighborhoodDisplay}`} />
//           {`${cityDisplay}${stateDisplay}`}
//         </Text>
//       );
//     }

//     return (
//       <Text>
//         {`${neighborhoodDisplay}`}
//         <TextBold text={`${cityDisplay}`} />
//         {`${stateDisplay}`}
//       </Text>
//     );
//   }

//   return null;
// };

// const getChatName = (usernames, me) => {
//   if (!usernames) {
//     return 'No Name';
//   }

//   const userArrays = usernames.split(',');

//   if (userArrays.length <= 1) return usernames;
//   const userArraysWithoutMe = userArrays.reduce((acc, currentItem) => {
//     if (currentItem && currentItem !== '' && currentItem.trim() !== me) {
//       acc.push(currentItem.trim());
//     }
//     return acc;
//   }, []);
//   if (userArraysWithoutMe.length > 1) {
//     return userArraysWithoutMe.join(', ');
//   }
//   if (userArraysWithoutMe.length === 1) {
//     return userArraysWithoutMe[0].trim();
//   }
//   return 'No name';
// };

// const getGroupMemberCount = (channel) => Object.keys(channel?.state?.members).length;

// let styles = StyleSheet.create({
//   bold: {
//     fontFamily: 'Inter',
//     fontStyle: 'normal',
//     fontWeight: 'bold',
//     fontSize: 14,
//     lineHeight: 17,
//     color: '#000000'
//     // textTransform: 'capitalize',
//   }
// });

// const convertString = (str, from, to) => {
//   if (str === null || str === undefined) return str;
//   return str.split(from).join(to);
// };

// /**
//  *
//  * @param {String} topic
//  * @returns {String}
//  */
// const convertTopicNameToTopicPageScreenParam = (topic) => {
//   const lowerCaseTopic = topic.toLocaleLowerCase();
//   const sanitizeSpaceTopic = lowerCaseTopic.split(' ').join('-');
//   return `topic_${sanitizeSpaceTopic}`;
// };

// const capitalizeFirstText = (str) => {
//   // split the above string into an array of strings
//   // whenever a blank space is encountered

//   const arr = str.split(' ');

//   // loop through each element of the array and capitalize the first letter.

//   // eslint-disable-next-line no-plusplus
//   for (let i = 0; i < arr.length; i++) {
//     arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
//   }

//   // Join all the elements of the array back into a string
//   // using a blankspace as a separator
//   const str2 = arr.join(' ');
//   return str2;
// };

// const randomString = (length) => {
//   let result = '';
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const charactersLength = characters.length;
//   // eslint-disable-next-line no-plusplus
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// };

// /**
//  *
//  * @param {Number} number
//  * @param {String} singularText
//  * @param {String} pluralText
//  * @returns
//  */
// const getSingularOrPluralText = (number, singularText, pluralText) => {
//   if (number === 1) return singularText;
//   return pluralText;
// };

// /**
//  *
//  * @param {String} text
//  * @param {Any} navigation
//  * @returns
//  */
// const getCaptionWithTopicStyle = (idParams, text, navigation, substringEnd, topics = []) => {
//   const topicWithPrefix = idParams;
//   const id = removePrefixTopic(topicWithPrefix);
//   const topicRegex = /\B(\#[a-zA-Z0-9_+-]+\b)(?!;)/;
//   const validationTextHasAt = /\B(\@[a-zA-Z0-9_+-]+\b)(?!;)/;
//   substringEnd = Math.round(substringEnd);
//   text = reactStringReplace(text, topicRegex, (match) => {
//     if (topics?.indexOf(match?.replace('#', '')) > -1)
//       return <TopicText navigation={navigation} text={match} currentTopic={id} />;
//     return match;
//   });

//   text = reactStringReplace(text, validationTextHasAt, (match) => (
//     <TaggingUserText navigation={navigation} text={match} currentTopic={id} />
//   ));
//   if (substringEnd && typeof substringEnd === 'number') {
//     text[text.length - 1] = text[text.length - 1].substring(0, substringEnd);
//   }
//   return text;
// };

// const removeStringAfterSpace = (str) => str.split(' ')[0];

// const sanitizeUrl = (message) => {
//   if (message && typeof message === 'string') {
//     return message.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim();
//   }
//   return '';
// };

// const getHourText = (day, hourParam) => {
//   if (day > 0 && hourParam > 0) return `, ${hourParam}h`;
//   if (day === 0 && hourParam > 0) return ` ${hourParam}h`;
//   return '';
// };

// const getMinuteText = (minuteParam, hourParam) => {
//   if (hourParam > 0 && minuteParam > 0) return `, ${minuteParam}m`;
//   if (hourParam === 0 && minuteParam > 0) return ` ${minuteParam}m`;
//   return '';
// };

// const getDurationTimeText = (selectedtime) => {
//   const dayText = selectedtime.day > 0 ? `${selectedtime.day} Day(s)` : '';
//   const hourText = getHourText(selectedtime?.day, selectedtime?.hour);
//   const minuteText = getMinuteText(selectedtime?.minute, selectedtime?.hour);

//   return `${dayText}${hourText}${minuteText}`;
// };
