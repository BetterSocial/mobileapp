import {validationURL, getUrl, isContainUrl} from '../../src/utils/Utils';

describe('Validation URL', () => {
  test('url valid https', () => {
    expect(validationURL('https://jestjs.io/docs/getting-started')).toBe(true);
  });
  test('url valid http', () => {
    expect(validationURL('http://www.facebook.com')).toBe(true);
  });
  test('url invalid http', () => {
    expect(validationURL('httpjestjsio/docs/getting-started')).toBe(false);
  });
  test('url invalid', () => {
    expect(validationURL('ini facebook')).toBe(false);
  });
});

describe('get url from string', () => {
  test('should get url', () => {
    expect(
      getUrl(
        'ini facebook iah https://www.facebook.com ini google http://www.google.com',
      ),
    ).toBe('https://www.facebook.com');
  });
  test('should get not url', () => {
    expect(getUrl('ini facebook iah')).toBe('ini facebook iah');
  });
});

describe('Validation string has contain url', () => {
  test('should true url', () => {
    expect(isContainUrl('ini facebook iah https://www.facebook.com')).toBe(
      true,
    );
  });
  test('should false url', () => {
    expect(isContainUrl('ini facebook iah')).toBe(false);
  });
});
