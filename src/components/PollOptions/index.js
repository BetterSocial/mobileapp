import React from 'react';
import {StyleSheet, TouchableNativeFeedback, View, Text} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

let PollOptions = ({item, index, total}) => {
  let optionPercentage = total === 0 ? 0 : item.counter / total;
  return (
    <TouchableNativeFeedback>
      <View
        key={`poll-options-${index}`}
        style={
          index % 2 === 0
            ? styles.pollOptionItemContainerActive
            : styles.pollOptionItemContainer
        }>
        <View style={styles.percentageBar(optionPercentage)} />
        <View style={styles.pollOptionTextContainer}>
          <View
            style={
              index % 2 === 0
                ? styles.pollRadioButtonActive
                : styles.pollRadioButton
            }
          />
          <Text style={styles.pollOptionItemText}>{item.option}</Text>
          {/* <Text style={styles.pollOptionItemPercentage}>{`${optionPercentage}%`}</Text> */}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

let styles = StyleSheet.create({
  pollOptionsContainer: {
    // borderColor : 'red',
    // borderWidth : 4,
    width: '100%',
    padding: 0,
    marginTop: 16,
    marginBottom: 8,
  },
  pollOptionItemContainer: {
    // borderColor : colors.holytosca,
    backgroundColor: colors.lightgrey,
    // borderWidth : 1.25,
    marginBottom: 8,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  pollOptionItemContainerActive: {
    // borderColor : colors.holytosca,
    backgroundColor: colors.holytosca30percent,
    // borderWidth : 1.25,
    marginBottom: 8,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  pollOptionTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  pollOptionItemText: {
    flex: 1,
    color: colors.black,
    fontFamily: fonts.inter[400],
    // backgroundColor : 'red'
  },
  pollOptionItemPercentage: {
    // backgroundColor : 'red'
  },
  percentageBar: (percent) => {
    if (!percent) {
      percent = 0;
    }
    if (percent > 100) {
      percent = 100;
    }

    return {
      width: `${percent}%`,
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: colors.bondi_blue,
    };
  },
  totalpolltext: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 16,
    color: colors.blackgrey,
  },
  pollRadioButton: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 6,
    borderColor: colors.black,
    borderWidth: 1,
    marginEnd: 12,
  },

  pollRadioButtonActive: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: colors.holytosca,
    marginEnd: 12,
  },
  totalVotesContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default PollOptions;
