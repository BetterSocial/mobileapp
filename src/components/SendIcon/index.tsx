import React from 'react';
import {StyleSheet} from 'react-native';
import MemoSendComment from '../../assets/icon/IconSendComment';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  icSendButton: {
    alignSelf: 'center'
  }
});

interface SendIconProps {
  type?: string;
  isDisabled?: boolean;
}

const SendIcon: React.FC<SendIconProps> = ({type, isDisabled}) => {
  const iconBackgroundColorStyle = React.useCallback(() => {
    if (isDisabled) return COLORS.gray210;
    if (type === 'SIGNED') return COLORS.signed_primary;
    return COLORS.anon_primary;
  }, [isDisabled, type]);

  const iconColorStyle = React.useCallback(() => {
    if (isDisabled) return COLORS.gray310;
    return COLORS.white;
  }, [isDisabled]);

  return (
    <MemoSendComment
      style={styles.icSendButton}
      fillBackground={iconBackgroundColorStyle()}
      fillIcon={iconColorStyle()}
    />
  );
};

export default SendIcon;
