import * as React from 'react';
import {
  StyleSheet,
  TouchableNativeFeedback,
  View,
  Text,
  Image,
} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import IconPollWinnerBadge from '../../assets/icon/IconPollWinnerBadge';
import IconPollMine from '../../assets/icon/IconPollMine';

let PollOptions = ({
  mypoll,
  poll,
  index,
  total,
  selectedindex,
  isexpired = false,
  isalreadypolling = false,
  maxpolls = [],
  onselected = (index) => {},
}) => {
  let counter = poll?.counter || 10;
  let optionPercentage = total === 0 ? 0 : (counter / total) * 100;

  let isPollDisabled = () => isexpired || isalreadypolling;
  let onPollPressed = () => {
    if (isalreadypolling) {
      return;
    }
    onselected(index);
  };

  let isMyPoll = () => mypoll?.polling_option_id === poll?.polling_option_id;
  let isPollNotEndedAndIsMax =
    isalreadypolling && maxpolls.includes(poll.polling_option_id);

  let isPollNotEndedAndIsMine = isalreadypolling && isMyPoll();
  let isMax = maxpolls.includes(poll.polling_option_id);

  let renderPercentageBar = () => {
    if (isexpired) {
      return (
        <View style={styles.expiredPercentageBar(optionPercentage, isMax)} />
      );
    } else if (isPollNotEndedAndIsMax) {
      return (
        <View style={styles.expiredPercentageBar(optionPercentage, isMax)} />
      );
    } else if (isalreadypolling) {
      return (
        <View style={styles.percentageBar(optionPercentage, isMyPoll())} />
      );
    }
  };

  let renderPollBadge = () => {
    if (isMax) {
      return (
        <IconPollWinnerBadge style={{marginRight: 9, alignSelf: 'center'}} />
      );
    } else if (isPollNotEndedAndIsMine) {
      return <IconPollMine style={{marginRight: 9, alignSelf: 'center'}} />;
    } else {
      return <></>;
    }
  };

  return (
    <TouchableNativeFeedback
      style={{backgroundColor: 'red'}}
      disabled={isPollDisabled()}
      onPress={onPollPressed}>
      <View
        key={`poll-options-${index}`}
        style={
          selectedindex === index
            ? styles.pollOptionItemContainerActive
            : styles.pollOptionItemContainer
        }>
        {renderPercentageBar()}
        <View style={styles.pollOptionTextContainer}>
          {isPollDisabled() ? (
            renderPollBadge()
          ) : (
            <View
              style={
                selectedindex === index
                  ? styles.pollRadioButtonActive
                  : styles.pollRadioButton
              }
            />
          )}
          <Text style={styles.pollOptionItemText(isexpired, isMax)}>
            {poll?.option}
          </Text>
          {isPollDisabled() ? (
            <Text
              style={
                styles.pollOptionItemPercentage
              }>{`${optionPercentage}%`}</Text>
          ) : (
            <></>
          )}
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
    height: 56,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  pollOptionItemContainerActive: {
    backgroundColor: colors.holytosca30percent,
    height: 56,
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
    paddingHorizontal: 16,
  },
  pollOptionItemText: (isexpired, ismax) => {
    return {
      flex: 1,
      color: colors.black,
      fontFamily: fonts.inter[400],
      marginStart: 0,
      alignSelf: 'center',
    };
  },
  pollOptionItemPercentage: {},
  percentageBar: (percent, isMyPoll = false) => {
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
      borderRadius: 6,
      backgroundColor: isMyPoll ? colors.bondi_blue : colors.gray1,
    };
  },
  expiredPercentageBar: (percent, isMax = false) => {
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
      borderRadius: 6,
      backgroundColor: isMax ? COLORS.blueSea : colors.gray1,
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
