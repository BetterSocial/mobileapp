import {Linking} from 'react-native';
import {act} from '@testing-library/react-hooks';
import {waitFor} from '@testing-library/react-native';

import {
  getUrl,
  isContainUrl,
  isEmptyOrSpaces,
  locationValidation,
  openUrl,
  removeWhiteSpace,
  sanitizeUrlForLinking,
  setCapitalFirstLetter,
  showScoreAlertDialog,
  validationURL
} from '../../src/utils/Utils';

const mockToast = jest.fn();
const mockAlert = jest.fn();

jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
  show: mockToast
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: mockAlert
}));

function mockSuccessLinking() {
  const canOpenURL = jest
    .spyOn(Linking, 'canOpenURL')
    .mockImplementation(() => Promise.resolve(true));
  const openURL = jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve(true));

  return {canOpenURL, openURL};
}

function mockFailLinking() {
  const canOpenURL = jest
    .spyOn(Linking, 'canOpenURL')
    .mockImplementation(() => Promise.resolve(false));
  const openURL = jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve(false));

  return {canOpenURL, openURL};
}

describe('Utils function run correctly', () => {
  it('sanitizeUrlForLinking should run correctly', () => {
    const url = 'https://www.detik.com';
    expect(sanitizeUrlForLinking(url)).toStrictEqual('https://detik.com');
  });

  it('sanitizeUrlForLinking set prefix https if not set', () => {
    const url = 'detik.com';
    expect(sanitizeUrlForLinking(url)).toStrictEqual('https://detik.com');
  });

  it('setCapitalFirstLetter should run correctly', () => {
    const letter = 'rumah baru';
    expect(setCapitalFirstLetter(letter)).toStrictEqual('Rumah baru');
  });

  it('setCapitalFirstLetter should return empty string if not set', () => {
    const letter = null;
    expect(setCapitalFirstLetter(letter)).toStrictEqual('');
  });

  it('openUrl should run correctly', async () => {
    const {canOpenURL, openURL} = mockSuccessLinking();
    const url = 'https://www.detik.com';
    act(() => {
      openUrl(url);
    });
    expect(canOpenURL).toHaveBeenCalled();
    await waitFor(() => {
      expect(openURL).toHaveBeenCalled();
    });
  });

  it('openUrl should show toast if fail', async () => {
    const {canOpenURL, openURL} = mockFailLinking();
    const url = 'https://www.detik.com';
    act(() => {
      openUrl(url);
    });
    expect(canOpenURL).toHaveBeenCalled();
    await waitFor(() => {
      expect(openURL).toHaveBeenCalled();
    });
  });

  it('removeWhiteSpace should run correctly', () => {
    const text = '     test spasi depan';
    expect(removeWhiteSpace(text)).toStrictEqual('test spasi depan');
  });

  it('removeWhiteSpace should return empty string if not set', () => {
    const text = null;
    expect(removeWhiteSpace(text)).toStrictEqual('');
  });

  it('validationUrl should run correctly', () => {
    let url = 'https://detik.com';
    expect(validationURL(url)).toStrictEqual(true);
    url = 'test123';
    expect(validationURL(url)).toStrictEqual(false);
  });

  it('expect get url should runt correctly', () => {
    const url = 'https://detik.com';
    const notUrl = 'test';
    expect(getUrl(url)).toStrictEqual(url);
    expect(getUrl(notUrl)).toEqual(notUrl);
  });

  it('isEmptyOrSpaces should run correctly', () => {
    expect(isEmptyOrSpaces(' ')).toBeTruthy();
    expect(isEmptyOrSpaces('halo')).toBeFalsy();
  });

  it('isContainUrl should run correctly', () => {
    expect(isContainUrl('http://detik.com')).toBeTruthy();
    expect(isContainUrl('hal')).toBeFalsy();
  });

  it('showScoreAlertDialog should run correctly', () => {
    const location1 = {
      score_details: undefined
    };
    const location2 = {
      score_details: 10
    };
    act(() => {
      showScoreAlertDialog(location1);
    });
    expect(mockAlert).toHaveBeenCalled();
    act(() => {
      showScoreAlertDialog(location2);
    });
    expect(mockAlert).toHaveBeenCalled();
  });
  it('locationValidation should run correctly', () => {
    const location = {
      location_level: 'Neighborhood',
      neighborhood: 'bantul'
    };
    const location1 = {
      location_level: 'city',
      city: 'yogyakarta'
    };
    const location2 = {
      location_level: 'State',
      state: 'sleman'
    };
    const location3 = {
      location_level: 'Country',
      country: 'indonesia'
    };
    expect(locationValidation(location)).toEqual(location.neighborhood);
    expect(locationValidation(location1)).toEqual(location1.city);
    expect(locationValidation(location2)).toEqual(location2.state);
    expect(locationValidation(location3)).toEqual(location3.country);
  });
});
