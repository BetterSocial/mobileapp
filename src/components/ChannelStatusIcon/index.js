import * as React from 'react';
import moment from 'moment';
import {StyleSheet, Text, View} from 'react-native';

import {calculateTime} from '../../utils/time';

const ChannelStatusIcon = (props) => {
  const renderDate = () => {
    const updatedAt = props?.latestMessagePreview?.messageObject?.updated_at;
    if (!updatedAt) return <></>;

    const diffTime = calculateTime(moment(updatedAt), true);
    return <Text style={styles.time}>{diffTime}</Text>;
  };

  return <View style={styles.dateContainer}>{renderDate()}</View>;
};

const styles = StyleSheet.create({
  time: {
    fontSize: 12,
    marginLeft: 4
  },

  dateContainer: {
    paddingRight: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
    // backgroundColor: 'red'
  }
});

export default ChannelStatusIcon;
