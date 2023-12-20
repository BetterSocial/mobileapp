import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {Alert, Linking} from 'react-native';

import StringConstant from './string/StringConstant';

export const sanitizeUrlForLinking = (url) => {
  if (!/^https?:\/\//.test(url)) {
    url = `https://${url}`;
  }

  return url.replace(/(www\.)/, '');
};

export const smartRender = (ElementOrComponentOrLiteral, props, fallback) => {
  if (ElementOrComponentOrLiteral === undefined) {
    ElementOrComponentOrLiteral = fallback;
  }
  if (React.isValidElement(ElementOrComponentOrLiteral)) {
    // Flow cast through any, to make flow believe it's a React.Element
    const element = ElementOrComponentOrLiteral;
    return element;
  }

  // Flow cast through any to remove React.Element after previous check
  const ComponentOrLiteral = ElementOrComponentOrLiteral;
  if (
    typeof ComponentOrLiteral === 'string' ||
    typeof ComponentOrLiteral === 'number' ||
    typeof ComponentOrLiteral === 'boolean' ||
    ComponentOrLiteral == null
  ) {
    return ComponentOrLiteral;
  }
  return <ComponentOrLiteral {...props} />;
};

export const validationURL = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
};

export const getUrl = (str) => {
  if (str) {
    const url = str.match(/(https?\:\/\/)?([^\.\s]+)?[^\.\s]+\.[^\s]+/gi);
    if (Array.isArray(url)) {
      return url[0];
    }
    return str;
  }
  return null;
};

export const isContainUrl = (str) => {
  const url = getUrl(str);
  return validationURL(url);
};

export const openUrl = (url, force = false) => {
  if (url && typeof url === 'string') {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        if (force) return Linking.openURL(url);
        SimpleToast.show(StringConstant.generalCannotOpenLink, SimpleToast.SHORT);
      }

      return true;
    });
  }
};

export const setCapitalFirstLetter = (text) => {
  if (text && typeof text === 'string') {
    const capital = text.charAt(0).toUpperCase();
    const notCapital = text.slice(1);
    return `${capital}${notCapital}`;
  }

  return '';
};

export const removeWhiteSpace = (txt) => {
  if (txt && typeof txt === 'string') {
    return txt.trim();
  }

  return '';
};

export function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

export function showScoreAlertDialog(location) {
  if (location.score_details === undefined) return Alert.alert("This post doesn't have score yet");

  const ordered = Object.keys(location.score_details)
    .sort((a, b) => location.score_details[b] - location.score_details[a])
    .reduce((obj, key) => {
      obj[key] = location.score_details[key];
      return obj;
    }, {});

  let textScoreDetails = '';
  Object.keys(ordered).forEach((key) => {
    const value = ordered[key];
    textScoreDetails += `${key} = ${value} \n`;
  });

  Alert.alert(textScoreDetails);
  return '';
}

export const locationValidation = (location) => {
  if (location.location_level.toLocaleLowerCase() === 'neighborhood') {
    return location.neighborhood;
  }
  if (location.location_level.toLocaleLowerCase() === 'city') {
    return location.city;
  }
  if (location.location_level.toLocaleLowerCase() === 'state') {
    return location.state;
  }
  return location.country;
};

/**
 *
 * @param {String} text
 * @param {String[]} topics
 * @returns {String[]}
 */
export const filterAllTopics = (text, topics = []) => {
  const topicsFromText = text.match(/#([A-Z0-9-_]+)\b/gi) || [];
  const topicsFromTextWithoutHashtag = topicsFromText.reduce((acc, next) => {
    acc.push(next.slice(1));
    return acc;
  }, []);

  return [...new Set([...topicsFromTextWithoutHashtag, ...topics])];
};
