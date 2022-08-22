import * as React from 'react';
import moment from 'moment';
import reactStringReplace from 'react-string-replace'
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme';
import { fonts } from '../fonts';

const NO_POLL_UUID = '00000000-0000-0000-0000-000000000000';

const getPollTime = (pollExpiredAtString) => {
    const currentMoment = moment();
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
        return `Poll closed ${Math.abs(diffInHours)}h ${Math.abs(
            diffInMinutes % 60,
        )}m ago`;
    }
    return `Poll closed ${Math.abs(diffInMinutes % 60)}m ago`;


};

const isPollExpired = (pollExpiredAtString) => moment(pollExpiredAtString).diff(moment()) < 0;

const displayFormattedSearchLocations = (searchQuery, locationObject) => {
    // console.log(searchQuery)
    // if (locationObject.country.toLowerCase() === searchQuery.toLowerCase()) {
    //   return <Text style={styles.bold}>{locationObject.country}</Text>;
    // }
    const zipString =
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
        const zipString =
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

    if (locationObject.location_level === "Country") {
        return <Text>{`${locationObject.country}${zipString}`}</Text>
    }

    if (locationObject.location_level === "State") {
        return <Text>{`${locationObject.state}, ${locationObject.country}${zipString}`}</Text>
    }

    if (locationObject.location_level === "City") {
        return <Text>{`${locationObject.city} , ${locationObject.state}, ${locationObject.country}${zipString}`}</Text>
    }

    // if (locationObject.neighborhood === null) {
    //   return (
    //     <Text>{`${locationObject.city}, ${locationObject.state}, ${locationObject.country}`}</Text>
    //   );

    // }

    return (
        <Text>{`${locationObject.neighborhood}, ${locationObject.city}, ${locationObject.state}, ${locationObject.country}`}</Text>
    );
};

const getChatName = (usernames, me) => {
    if (!usernames) {
        return 'No Name';
    }

    const userArrays = usernames.split(',');

    if (userArrays.length <= 1) return usernames
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


const convertString = (str, from, to) => str.split(from).join(to);

/**
 * 
 * @param {String} topic 
 * @returns {String}
 */
const convertTopicNameToTopicPageScreenParam = (topic) => {
    const lowerCaseTopic = topic.toLocaleLowerCase()
    const sanitizeSpaceTopic = lowerCaseTopic.split(` `).join('-')
    return `topic_${sanitizeSpaceTopic}`
}

const capitalizeFirstText = (str) => {
    // split the above string into an array of strings 
    // whenever a blank space is encountered

    const arr = str.split(" ");

    // loop through each element of the array and capitalize the first letter.


    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    }

    // Join all the elements of the array back into a string 
    // using a blankspace as a separator 
    const str2 = arr.join(" ");
    return str2;
}

const randomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    console.log(result)
    return result;
}

/**
 * 
 * @param {Number} number 
 * @param {String} singularText 
 * @param {String} pluralText 
 * @returns 
 */
const getSingularOrPluralText = (number, singularText, pluralText) => {
    if (number === 1) return singularText
    return pluralText
}

/**
 * 
 * @param {String} text 
 * @param {Any} navigation 
 * @returns 
 */
const getCaptionWithTopicStyle = (text, navigation) => {
    const onClick = (match) => {
        // Do navigation here
        if (!navigation) return
        // console.log(`topic ${match}`)
        navigation.navigate('TopicPageScreen', { id: match.replace('#', '') })
    }

    text = reactStringReplace(text, /\B(\#[a-zA-Z0-9]+\b)(?!;)/, (match, index) =>
        // console.log(`${match} ${index}`)
        // console.log(match)
        <Text onPress={() => onClick(match)} style={{
            color: COLORS.blue, fontFamily: fonts.inter[500]
        }}>{match}</Text>
    )

    return text
}

const removeStringAfterSpace = str => str.split(' ')[0]

export {
    capitalizeFirstText,
    convertString,
    convertTopicNameToTopicPageScreenParam,
    displayFormattedSearchLocations,
    getCaptionWithTopicStyle,
    getChatName,
    getGroupMemberCount,
    getPollTime,
    getSingularOrPluralText,
    isPollExpired,
    NO_POLL_UUID,
    randomString,
    removeStringAfterSpace,
};
