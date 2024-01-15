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
  const sendButtonStyle = React.useCallback(() => {
    if (isDisabled) return COLORS.gray1;
    if (type === 'SIGNED') return COLORS.signed_primary;
    return COLORS.anon_primary;
  }, [isDisabled, type]);

  return (
    <MemoSendComment
      style={styles.icSendButton}
      fillBackground={sendButtonStyle()}
      fillIcon={COLORS.white}
    />
  );
};

export default SendIcon;
