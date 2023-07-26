import moment from 'moment';

import {calculateTime} from '../../src/utils/time';

describe('Util time should correct', () => {
  it('calculated time should run correctly', () => {
    const less1Minute = moment().subtract(1, 'minute');
    const less24Hours = moment().subtract(20, 'hour');
    const less2Days = moment().subtract(1, 'day');
    const lessThan50Second = moment().subtract(50, 'second');
    const lessThanWeek = moment().subtract(5, 'day');
    const lessThan2Weeks = moment().subtract(10, 'day');
    const lessThan3Weeks = moment().subtract(15, 'day');
    expect(calculateTime(less1Minute)).toEqual('1m ago');
    expect(calculateTime(less24Hours)).toEqual('20h ago');
    expect(calculateTime(less2Days)).toEqual('1d ago');
    expect(calculateTime(lessThan50Second)).toEqual('1m ago');
    expect(calculateTime(lessThanWeek)).toEqual('5d ago');
    expect(calculateTime(lessThan2Weeks)).toEqual('1w ago');
    expect(calculateTime(lessThan3Weeks)).toEqual('2w ago');
  });
});
