import * as React from 'react';
import moment from 'moment';
import {Text} from 'react-native';

import TextBold from '../../src/components/Text/TextBold';
import {
  capitalizeFirstText,
  convertString,
  convertTopicNameToTopicPageScreenParam,
  displayCityName,
  displayFormattedSearchLocationsV2,
  getChatName,
  getDurationTimeText,
  getGroupMemberCount,
  getPollTime,
  isLocationMatch,
  isPollExpired,
  removeStringAfterSpace,
  sanitizeUrl
} from '../../src/utils/string/StringUtils';

describe('SringUtils should be run correctly', () => {
  it('getPollTime  should run correctly', () => {
    const hours = moment().add('hour', 2);
    const days = moment().add('day', 2);
    const minutes = moment().add('minute', 2);

    const expiredHourse = moment().subtract('hours', 2);
    const expiredDays = moment().subtract('day', 2);
    const minute = moment().add(40, 'minute');
    expect(getPollTime(hours)).toEqual('1h 59m left');
    expect(getPollTime(days)).toEqual('1d left');
    expect(getPollTime(minutes)).toEqual('1m left');
    expect(getPollTime(expiredDays)).toEqual('Poll closed 2d ago');
    expect(getPollTime(expiredHourse)).toEqual('Poll closed 0m ago');
    expect(getPollTime(minute)).toEqual('39m left');
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
    expect(displayCityName(null, starte)).toEqual(null);
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
    const usernamemuch =
      'agita, elon musk, steve jobs, bill gates, sundar pincay, bradpit, leonardo, rafael leao';
    expect(getChatName(null, null)).toEqual('No Name');
    expect(getChatName(username)).toEqual('agita');
    expect(getChatName(username2, 'agita')).toEqual('elon musk, steve jobs');
    expect(getChatName(username3)).toEqual('elon musk, steve jobs');
    expect(getChatName(username4, 'agita')).toEqual('elon');
    expect(getChatName(username5, 'agita')).toEqual('No Name');
    expect(getChatName(usernamemuch, 'agita')).toEqual(
      'elon musk, steve jobs, bill gates, sundar pincay, bradpit, leonardo & others'
    );
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

  it('display country while in match with query', () => {
    const location = {
      country: 'Indonesia',
      location_level: 'Country'
    };
    expect(displayFormattedSearchLocationsV2('indo', location)).toEqual(
      <Text>
        <TextBold text={'Indonesia'} />
      </Text>
    );
  });

  it('display country while not in match with query', () => {
    const location = {
      country: 'Indonesia',
      location_level: 'Country'
    };
    expect(displayFormattedSearchLocationsV2('US', location)).toEqual(<Text>Indonesia</Text>);
  });

  it('display state while in match with query', () => {
    const location = {
      state: 'Jawa Timur',
      location_level: 'State'
    };
    expect(displayFormattedSearchLocationsV2('jawa', location)).toEqual(
      <Text>
        <TextBold text={'Jawa Timur'} />
      </Text>
    );
  });

  it('display state while not in match with query', () => {
    const location = {
      state: 'Jawa Timur',
      location_level: 'State'
    };
    expect(displayFormattedSearchLocationsV2('sumatra', location)).toEqual(
      <Text>
        <TextBold text={'Jawa Timur'} />
      </Text>
    );
  });

  it('display city while in match with query', () => {
    const location = {
      state: 'Jawa Timur',
      city: 'Surabaya, Jawa Timur',
      neighborhood: 'Darmo',
      location_level: 'City'
    };
    expect(displayFormattedSearchLocationsV2('jawa', location)).toEqual(
      <Text>
        <TextBold text="Surabaya, Jawa Timur" />
        {''}
      </Text>
    );
  });

  it('display city while not in match with query', () => {
    const location = {
      state: 'Jawa Timur',
      city: 'Surabaya, Jawa Timur',
      neighborhood: 'Darmo',
      location_level: 'City'
    };
    expect(displayFormattedSearchLocationsV2('sumatra', location)).toEqual(
      <Text>
        <TextBold text="Surabaya, Jawa Timur" />
        {''}
      </Text>
    );
  });

  it('display neighborhood while in match with query', () => {
    const location = {
      state: 'Jawa Timur',
      city: 'Surabaya, Jawa Timur',
      neighborhood: 'Darmo',
      location_level: 'Neighborhood'
    };
    expect(displayFormattedSearchLocationsV2('Jawa', location)).toEqual(
      <Text>
        {'Darmo, '}
        <TextBold text="Surabaya, Jawa Timur" />
        {''}
      </Text>
    );
  });

  it('display neighborhood while not in match with query', () => {
    const location = {
      state: 'Jawa Barat',
      city: 'Surabaya, Jawa Timur',
      neighborhood: 'Surabaya',
      location_level: 'Neighborhood'
    };
    expect(displayFormattedSearchLocationsV2('Surabaya', location)).toEqual(
      <Text>
        <TextBold text="Surabaya, Surabaya, Jawa Timur" />
        {''}
      </Text>
    );
  });

  it('display neighborhood while not in match with query', () => {
    const location = {
      state: 'Jawa Timur',
      city: 'Surabaya, Jawa Timur',
      neighborhood: 'Darmo',
      location_level: 'Neighborhood'
    };
    expect(displayFormattedSearchLocationsV2('Sumatra', location)).toEqual(
      <Text>
        {'Darmo, '}
        <TextBold text="Surabaya, Jawa Timur" />
        {''}
      </Text>
    );
  });

  it('getDurationTimeText should pass', () => {
    const selectedTime1 = {
      day: 0,
      hour: 1,
      minute: 0
    };

    expect(getDurationTimeText(selectedTime1)).toEqual(' 1h');

    const selectedTime2 = {
      day: 0,
      hour: 1,
      minute: 1
    };

    expect(getDurationTimeText(selectedTime2)).toEqual(' 1h, 1m');

    const selectedTime3 = {
      day: 1,
      hour: 0,
      minute: 0
    };

    expect(getDurationTimeText(selectedTime3)).toEqual('1 Day(s)');
  });

  it('sanitizeUrl should pass', () => {
    const url = 'https://www.google.com';
    expect(sanitizeUrl(url)).toEqual('');

    const url2 = null;
    expect(sanitizeUrl(url2)).toEqual('');
  });
});
