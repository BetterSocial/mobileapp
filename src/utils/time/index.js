import moment from 'moment';

export const calculateTime = (time) => {
  let now = moment();
  let utc = now;
  let date = moment(new Date(time).toISOString());
  let minutes = utc.diff(date, 'minutes');
  let hours = utc.diff(date, 'hours');
  let days = utc.diff(date, 'days');
  let weeks = utc.diff(date, 'weeks');

  if (days >= 30) {
    return new Date(date).toLocaleDateString;
  }

  if (minutes < 60) {
    if (minutes === 0) {
      return '1m ago';
    }
    return `${minutes}m ago`;
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 2) {
    return 'Yesterday ago';
  }

  if (days >= 2 && days <= 6) {
    return `${days}d ago`;
  }

  if (days >= 7 && days <= 13) {
    return '1w ago';
  }

  return `${weeks}w ago`;
};
