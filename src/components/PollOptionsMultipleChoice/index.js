/* eslint-disable import/no-named-as-default */
import * as React from 'react';
import CheckBox from '@react-native-community/checkbox';
import {Platform, StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import IconPollMine from '../../assets/icon/IconPollMine';
import IconPollWinnerBadge from '../../assets/icon/IconPollWinnerBadge';
import {colors} from '../../utils/colors';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import usePollOptionMultiple from './hooks/usePollOptionMultiple';

const PollOptionsMultipleChoice = ({
  item,
  mypoll,
  index,
  selectedindex,
  isexpired,
  isalreadypolling = false,
  maxpolls = [],
  onselected = () => {},
  total = 0,
  totalVotingUser = 0
}) => {
  const {
    onOptionsClicked,
    optionPercentage,
    isPollDisabled,
    selected,
    isMyPoll,
    isPollNotEndedAndIsMine,
    isMax,
    handleStyleBar
  } = usePollOptionMultiple({
    item,
    mypoll,
    index,
    selectedindex,
    isexpired,
    isalreadypolling,
    maxpolls,
    onselected,
    totalVotingUser
  });

  const renderPercentageBar = () => {
    if (isexpired) {
      return (
        <View
          testID="isExpired"
          style={[
            styles.barStyle,
            {
              width: `${handleStyleBar(optionPercentage)}%`,
              backgroundColor: isMax ? colors.bondi_blue : colors.gray1
            }
          ]}
        />
      );
    }
    if (isalreadypolling) {
      return (
        <View
          testID="isAlreadyPolling"
          style={[
            styles.barStyle,
            {
              width: `${handleStyleBar(optionPercentage)}%`,
              backgroundColor: isMyPoll() ? colors.bondi_blue : colors.gray1
            }
          ]}
        />
      );
    }
    return null;
  };

  const renderPollBadge = () => {
    if (isMax && isexpired) {
      return (
        <View testID="pollWinner">
          <IconPollWinnerBadge style={{marginRight: 9, alignSelf: 'center'}} />
        </View>
      );
    }
    if (isPollNotEndedAndIsMine) {
      return (
        <View testID="isPollNotEndedAndIsMine">
          <IconPollMine style={{marginRight: 9, alignSelf: 'center'}} />
        </View>
      );
    }
    return <View testID="nonePoll" />;
  };

  const checkboxStyle = StyleSheet.flatten([
    Platform.OS === 'ios' ? {width: 15, height: 15, alignSelf: 'center'} : {},
    {marginRight: 10}
  ]);

  return (
    <TouchableNativeFeedback
      testID="multiple"
      disabled={isPollDisabled()}
      onPress={onOptionsClicked}>
      <View
        style={selected ? styles.pollOptionItemContainerActive : styles.pollOptionItemContainer}>
        {renderPercentageBar()}
        <View style={styles.pollOptionTextContainer}>
          {isPollDisabled() ? (
            renderPollBadge()
          ) : (
            <CheckBox
              testID="checkbox"
              value={selected}
              boxType="square"
              tintColors={{true: colors.holytosca, false: colors.black}}
              style={checkboxStyle}
            />
          )}
          <Text style={styles.pollOptionItemText(isPollDisabled(), isMax)}>{item.option}</Text>
          {isPollDisabled() && (
            <Text testID="optionPercentage" style={styles.pollOptionItemPercentage}>{`${
              Math.round(optionPercentage * 10) / 10
            }%`}</Text>
          )}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  pollOptionsContainer: {
    width: '100%',
    padding: 0,
    marginTop: 16,
    marginBottom: 8
  },
  pollOptionItemContainer: {
    backgroundColor: colors.lightgrey,
    marginBottom: 8,
    borderRadius: 8,
    // height: 56,
    flex: 1,
    flexDirection: 'row'
  },
  pollOptionItemContainerActive: {
    backgroundColor: colors.holytosca30percent,
    marginBottom: 8,
    borderRadius: 8,
    // height: 56,
    flex: 1,
    flexDirection: 'row'
  },
  pollOptionTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pollOptionItemText: (isexpired, isMax) => ({
    flex: 1,
    textAlignVertical: 'center',
    color: colors.black,
    fontFamily: fonts.inter[400],
    marginTop: isMax ? 0 : isexpired ? 6 : 0,
    marginBottom: isMax ? 0 : isexpired ? 6 : 0,
    marginLeft: 0,
    fontSize: normalizeFontSize(14)
  }),
  pollOptionItemPercentage: {
    textAlignVertical: 'center',
    fontSize: normalizeFontSize(14)
  },
  totalpolltext: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: 16,
    color: colors.blackgrey
  },
  pollRadioButton: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 0,
    borderColor: colors.black,
    borderWidth: 1,
    marginEnd: 12
  },

  pollRadioButtonActive: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: colors.holytosca,
    marginEnd: 12
  },
  totalVotesContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  barStyle: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 6
  }
});

export default PollOptionsMultipleChoice;
