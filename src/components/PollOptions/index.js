import React from 'react';
import {StyleSheet, TouchableNativeFeedback, View, Text} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

let PollOptions = ({
  item,
  index,
  total,
  selectedindex,
  isexpired = false,
  onselected = (index) => {},
}) => {
  let optionPercentage = total === 0 ? 0 : item.counter / total;

  return (
    <TouchableNativeFeedback
      onPress={() => onselected(index)}
      disabled={isexpired}>
      <View
        key={`poll-options-${index}`}
        style={
          selectedindex === index
            ? styles.pollOptionItemContainerActive
            : styles.pollOptionItemContainer
        }>
        <View style={styles.percentageBar(optionPercentage)} />
        <View style={styles.pollOptionTextContainer}>
          {isexpired ? (
            <></>
          ) : (
            <View
              style={
                selectedindex === index
                  ? styles.pollRadioButtonActive
                  : styles.pollRadioButton
              }
            />
          )}
          <Text style={styles.pollOptionItemText(isexpired)}>
            {item.option}
          </Text>
          {/* <Text style={styles.pollOptionItemPercentage}>{`${optionPercentage}%`}</Text> */}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

let styles = StyleSheet.create({
  pollOptionsContainer: {
    width: '100%',
    padding: 0,
    marginTop: 16,
    marginBottom: 8,
  },
  pollOptionItemContainer: {
    backgroundColor: colors.lightgrey,
    marginBottom: 8,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  pollOptionItemContainerActive: {
    backgroundColor: colors.holytosca30percent,
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
  pollOptionItemText: (isexpired) => {
    return {
      flex: 1,
      color: colors.black,
      fontFamily: fonts.inter[400],
      marginStart: isexpired ? 12 : 0,
    };
  },
  pollOptionItemPercentage: {},
  percentageBar: (percent) => {
    if (!percent) percent = 0;
    if (percent > 100) percent = 100;

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
    marginEnd: 8,
  },

  pollRadioButtonActive: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: colors.holytosca,
    marginEnd: 8,
  },
  totalVotesContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default PollOptions;
