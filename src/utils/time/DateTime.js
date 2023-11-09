import Moment from 'moment';

/**
 * @param {String | Date} time
 * @returns {String}
 */
const format = (time) => {
  if (time === undefined || time === null) throw new Error('Param "time" is not defined or null');

  return Moment(time).format('MMM D, YYYY');
};

const DateTimeUtils = {
  format,
};

export default DateTimeUtils;
