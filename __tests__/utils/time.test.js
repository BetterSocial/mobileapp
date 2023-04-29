import moment from 'moment';
import {calculateTime} from '../../src/utils/time';
import DateTimeUtils from '../../src/utils/time/DateTime';

describe('time should run correctly', () => {
  it('calculate time should run correctly', () => {
    const dayMin1 = moment().subtract(15, 'second');
    const dayDay30 = moment().subtract(30, 'day');
    const dayMin10 = moment().subtract(10, 'minute');
    const dayHour4 = moment().subtract(4, 'hour');
    const dayDay1 = moment().subtract(1, 'day');
    const dayDay3 = moment().subtract(3, 'day');
    const dayWeek1 = moment().subtract(8, 'day');
    const dayWeek3 = moment().subtract(24, 'day');
    expect(calculateTime(dayMin1)).toEqual('1m ago');
    expect(calculateTime(dayDay30)).toEqual(DateTimeUtils.format(dayDay30));
    expect(calculateTime(dayMin10)).toEqual('10m ago');
    expect(calculateTime(dayHour4)).toEqual('4h ago');
    expect(calculateTime(dayDay1)).toEqual('Yesterday');
    expect(calculateTime(dayDay3)).toEqual('3d ago');
    expect(calculateTime(dayWeek1)).toEqual('1w ago');
    expect(calculateTime(dayWeek3)).toEqual('3w ago');
    expect(calculateTime(null)).toEqual('');
    expect(DateTimeUtils.format(null)).toEqual('');
  });
});
