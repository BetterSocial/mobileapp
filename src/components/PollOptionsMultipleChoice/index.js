import React, {useState} from 'react';
import {StyleSheet, TouchableNativeFeedback, View, Text} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

let PollOptionsMultipleChoice = ({
  item,
  index,
  total,
  selectedindex,
  isexpired,
  isalreadypolling = false,
  onselected = (index) => {},
}) => {
  let optionPercentage = total === 0 ? 0 : (item.counter / total) * 100;

  let isPollDisabled = () => isalreadypolling || isexpired;

  let selected = selectedindex.includes(index);

  let onOptionsClicked = () => {
    if (isPollDisabled()) return;
    if (selected) {
      let idx = selectedindex.indexOf(index);
      console.log('idx');
      console.log(idx);
      let newSelectedIndex = [...selectedindex];
      newSelectedIndex.splice(idx, 1);
      console.log('newSelectedIndex remove');
      console.log(newSelectedIndex);
      onselected(newSelectedIndex);
    } else {
      let newSelectedIndex = [...selectedindex];
      newSelectedIndex.push(index);
      console.log('newSelectedIndex add');
      console.log(newSelectedIndex);
      onselected(newSelectedIndex);
    }
  };

  return (
    <TouchableNativeFeedback onPress={onOptionsClicked}>
      <View
        key={`poll-options-${index}`}
        style={
          selected
            ? styles.pollOptionItemContainerActive
            : styles.pollOptionItemContainer
        }>
        <View style={styles.percentageBar(optionPercentage)} />
        <View style={styles.pollOptionTextContainer}>
          {/* <View
                style={
                    false
                    ? styles.pollRadioButtonActive
                    : styles.pollRadioButton
                }
                /> */}
          {isPollDisabled() ? (
            <></>
          ) : (
            <CheckBox
              value={selected}
              tintColors={{true: colors.holytosca, false: colors.black}}
              onChange={onOptionsClicked}
            />
          )}
          <Text style={styles.pollOptionItemText(isPollDisabled())}>
            {item.option}
          </Text>
          {isPollDisabled() && (
            <Text
              style={
                styles.pollOptionItemPercentage
              }>{`${optionPercentage}%`}</Text>
          )}
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
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pollOptionItemText: (isexpired) => {
    return {
      flex: 1,
      color: colors.black,
      fontFamily: fonts.inter[400],
      alignSelf: 'center',
      marginTop: isexpired ? 6 : 0,
      marginBottom: isexpired ? 6 : 0,
      marginLeft: isexpired ? 18 : 0,
      // backgroundColor : 'red'
    };
  },
  pollOptionItemPercentage: {
    // backgroundColor : 'red'
    alignSelf: 'center',
  },
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
    borderRadius: 0,
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

export default PollOptionsMultipleChoice;
