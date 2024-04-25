/* eslint-disable import/no-named-as-default */
import * as React from 'react';
import CheckBox from '@react-native-community/checkbox';
import {Dimensions, Platform, StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import IconPollMine from '../../assets/icon/IconPollMine';
import IconPollWinnerBadge from '../../assets/icon/IconPollWinnerBadge';
import usePollOptionMultiple from './hooks/usePollOptionMultiple';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const {height} = Dimensions.get('window');
const PollOptionsMultipleChoice = ({
  item,
  mypoll,
  index,
  selectedindex,
  isexpired,
  isalreadypolling = false,
  maxpolls = [],
  onselected = () => {},
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
              backgroundColor: isMax ? COLORS.signed_primary : COLORS.gray210
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
              backgroundColor: isMyPoll() ? COLORS.signed_primary : COLORS.gray210
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
      <View style={styles.pollOptionItemContainer}>
        {renderPercentageBar()}
        <View style={styles.pollOptionTextContainer}>
          {isPollDisabled() ? (
            renderPollBadge()
          ) : (
            <CheckBox
              testID="checkbox"
              value={selected}
              boxType="square"
              tintColors={{true: COLORS.anon_primary, false: COLORS.black}}
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
    backgroundColor: COLORS.gray110,
    marginBottom: 8,
    borderRadius: 8,
    height: (height * 7) / 100,
    flex: 1,
    flexDirection: 'row'
  },
  pollOptionItemContainerActive: {
    backgroundColor: COLORS.holytosca30percent,
    marginBottom: 8,
    borderRadius: 8,
    height: (height * 7) / 100,
    flex: 1,
    flexDirection: 'row'
  },
  pollOptionTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
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
    color: COLORS.black,
    fontFamily: fonts.inter[400],
    marginTop: isMax ? 0 : isexpired ? 6 : 0,
    marginBottom: isMax ? 0 : isexpired ? 6 : 0,
    marginLeft: 0,
    fontSize: normalizeFontSize(14)
  }),
  pollOptionItemPercentage: {
    textAlignVertical: 'center',
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    color: COLORS.white
  },
  totalpolltext: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: 16,
    color: COLORS.gray410
  },
  pollRadioButton: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 0,
    borderColor: COLORS.black,
    borderWidth: 1,
    marginEnd: 12
  },

  pollRadioButtonActive: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 8,
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
    borderRadius: 8
  }
});

export default React.memo(PollOptionsMultipleChoice);
