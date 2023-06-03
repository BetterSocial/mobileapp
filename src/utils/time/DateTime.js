import Moment from 'moment';

/**
 * @param {String | Date} time
 * @returns {String}
 */
const format = (time) => {
  if (time === undefined || time === null) return '';

  return Moment(time).format('MMM D, YYYY');
};

const DateTimeUtils = {
  format
};

export default DateTimeUtils;
