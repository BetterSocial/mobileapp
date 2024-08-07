import * as React from 'react';
import {StyleSheet, TouchableNativeFeedback, View, Text, Dimensions, Platform} from 'react-native';
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
      return <View testID="isAlreadyPollingOption" style={styles.percentageBar(percentage)} />;
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
          <Text style={styles.pollOptionItemText}>{poll?.option}</Text>
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
    backgroundColor: COLORS.gray110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    height: (screenHeight * 7) / 100
  },
  pollOptionsItemActiveContainer: {
    flex: 1,
    backgroundColor: COLORS.gray110,
    borderWidth: 1,
    borderColor: COLORS.signed_primary,
    marginBottom: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: (screenHeight * 7) / 100,
    width: '100%'
  },
  pollOptionTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  pollOptionItemText: {
    flex: 1,
    textAlignVertical: 'center',
    color: COLORS.black,
    fontFamily: fonts.inter[400],
    marginBottom: Platform.OS === 'ios' ? 0 : 3,
    fontSize: normalizeFontSize(14)
  },
  pollOptionItemPercentage: {
    textAlignVertical: 'center',
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    color: COLORS.white
  },
  percentageBar: (percent) => {
    return {
      width: percent,
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 8,
      backgroundColor: COLORS.gray210
    };
  },
  expiredPercentageBar: (percent, isMax = false) => {
    return {
      width: percent,
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 8,
      backgroundColor: isMax ? COLORS.signed_primary : COLORS.gray210
    };
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
    borderRadius: 6,
    borderColor: COLORS.black,
    borderWidth: 1,
    marginEnd: 8
  },

  pollRadioButtonActive: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: COLORS.anon_primary,
    marginEnd: 8
  },
  totalVotesContainer: {
    display: 'flex',
    flexDirection: 'row'
  }
});

export default React.memo(PollOptions);
