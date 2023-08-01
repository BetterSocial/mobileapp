import moment from 'moment';

import DateTimeUtils from './DateTime';

export const calculateTime = (time, formatForChatTab = false) => {
  if (!time) {
    return '';
  }

  const now = moment();
  const utc = now;
  const date = moment.utc(time);
  const minutes = utc.diff(date, 'minutes');
  const hours = utc.diff(date, 'hours');
  const days = utc.diff(date, 'days');
  const weeks = utc.diff(date, 'weeks');

  if (days >= 30 && !formatForChatTab) {
    return DateTimeUtils.format(time);
  }

  if (minutes < 60) {
    return minutes === 0 ? '1m ago' : `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days === 1) {
    return formatForChatTab ? `${days}d ago` : 'Yesterday';
  }

  if (days >= 2 && days <= 6) {
    return `${days}d ago`;
  }

  if (days >= 7 && days <= 13) {
    return '1w ago';
  }

  return `${weeks}w ago`;
};
