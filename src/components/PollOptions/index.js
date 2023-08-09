import * as React from 'react';
import {StyleSheet, TouchableNativeFeedback, View, Text, Dimensions} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import IconPollWinnerBadge from '../../assets/icon/IconPollWinnerBadge';
import IconPollMine from '../../assets/icon/IconPollMine';

const {height: screenHeight} = Dimensions.get('window');

const PollOptions = ({
  mypoll,
  poll,
  index,
  total,
  selectedindex,
  isexpired = false,
  isalreadypolling = false,
  maxpolls = [],
  onselected = () => {}
}) => {
  const counter = poll?.counter || 10;
  const optionPercentage = total === 0 ? 0 : (counter / total) * 100;
  const isPollDisabled = () => isexpired || isalreadypolling;
  const onPollPressed = () => {
    if (isalreadypolling) {
      return;
    }
    onselected(index);
  };

  const isMyPoll = () => mypoll?.polling_option_id === poll?.polling_option_id;
  const isPollNotEndedAndIsMax = isalreadypolling && maxpolls.includes(poll.polling_option_id);

  const isPollNotEndedAndIsMine = isalreadypolling && isMyPoll();
  const isMax = maxpolls.includes(poll.polling_option_id);

  // eslint-disable-next-line consistent-return
  const renderPercentageBar = () => {
    const percentage = `${
      !optionPercentage ? 0 : optionPercentage > 100 ? 100 : optionPercentage
    }%`;
    if (isexpired) {
      return (
        <View testID="isExpiredPollOption" style={styles.expiredPercentageBar(percentage, isMax)} />
      );
    }
    if (isPollNotEndedAndIsMax) {
      return (
        <View
          testID="isPollNotEndedAndIsMax"
          style={styles.expiredPercentageBar(percentage, isMax)}
        />
      );
    }
    if (isalreadypolling) {
      return (
        <View
          testID="isAlreadyPollingOption"
          style={styles.percentageBar(percentage, isMyPoll())}
        />
      );
    }
  };

  const renderPollBadge = () => {
    if (isMax) {
      return <IconPollWinnerBadge style={{marginRight: 9, alignSelf: 'center'}} />;
    }
    if (isPollNotEndedAndIsMine) {
      return <IconPollMine style={{marginRight: 9, alignSelf: 'center'}} />;
    }
    return <></>;
  };

  return (
    <TouchableNativeFeedback
      key={index}
      testID="option"
      disabled={isPollDisabled()}
      onPress={onPollPressed}>
      <View
        key={`poll-options-${index}`}
        style={
          selectedindex === index
            ? styles.pollOptionsItemActiveContainer
            : styles.pollOptionsItemContainer
        }>
        {renderPercentageBar()}
        <View style={styles.pollOptionTextContainer}>
          {isPollDisabled() ? (
            renderPollBadge()
          ) : (
            <View
              style={
                selectedindex === index ? styles.pollRadioButtonActive : styles.pollRadioButton
              }
            />
          )}
          <Text style={styles.pollOptionItemText(isexpired, isMax)}>{poll?.option}</Text>
          {isPollDisabled() ? (
            <Text style={styles.pollOptionItemPercentage}>{`${
              Math.round(optionPercentage * 10) / 10
            }%`}</Text>
          ) : (
            <></>
          )}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  pollOptionsItemContainer: {
    flex: 1,
    backgroundColor: colors.lightgrey,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    height: (screenHeight * 7) / 100
  },
  pollOptionsItemActiveContainer: {
    flex: 1,
    backgroundColor: colors.holytosca30percent,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    height: (screenHeight * 7) / 100,
    width: '100%'
  },
  pollOptionTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  pollOptionItemText: () => ({
    flex: 1,
    textAlignVertical: 'center',
    color: colors.black,
    fontFamily: fonts.inter[400],
    marginStart: 0,
    marginBottom: 5,
    fontSize: normalizeFontSize(14)
  }),
  pollOptionItemPercentage: {
    textAlignVertical: 'center',
    fontSize: normalizeFontSize(14)
  },
  percentageBar: (percent, isMyPoll = false) => {
    return {
      width: percent,
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 6,
      backgroundColor: isMyPoll ? colors.bondi_blue : colors.gray1
    };
  },
  expiredPercentageBar: (percent, isMax = false) => {
    return {
      width: percent,
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 6,
      backgroundColor: isMax ? COLORS.blueSea : colors.gray1
    };
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
    borderRadius: 6,
    borderColor: colors.black,
    borderWidth: 1,
    marginEnd: 8
  },

  pollRadioButtonActive: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: colors.holytosca,
    marginEnd: 8
  },
  totalVotesContainer: {
    display: 'flex',
    flexDirection: 'row'
  }
});

export default React.memo(PollOptions, (prevProps, nextProps) => {
  return prevProps.isalreadypolling !== nextProps.isalreadypolling;
});
