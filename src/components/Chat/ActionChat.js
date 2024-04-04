import * as React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import MemoIc_arrow_left from '../../assets/chats/Ic_arrow_left';
import MemoIc_arrow_right from '../../assets/chats/Ic_arrow_right';
import MemoIc_block from '../../assets/chats/Ic_block';
import MemoIc_copy from '../../assets/chats/Ic_copy';
import MemoIC_trash from '../../assets/chats/IC_trash';
import {COLORS} from '../../utils/theme';

const ActionChat = ({children, isMe, active, all}) => {
  return (
    <View style={styles.container(active)}>
      {children}
      {active && (
        <View style={styles.action}>
          <TouchableOpacity style={styles.btn}>
            <MemoIc_arrow_left width={16.67} height={16.67} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <MemoIc_copy width={20} height={20} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.btn}>
          <MemoIC_trash width={20} height={20} />
        </TouchableOpacity> */}
          <TouchableOpacity style={styles.btn}>
            {isMe && <MemoIC_trash width={20} height={20} />}
            {!isMe && <MemoIc_block width={20} height={20} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <MemoIc_arrow_right width={16.67} height={16.67} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ActionChat;

const styles = StyleSheet.create({
  container: (active) => ({
    backgroundColor: active ? COLORS.anonSecondary20 : COLORS.almostBlack
  }),
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  action: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    backgroundColor: COLORS.gray100,
    flexDirection: 'row',
    borderRadius: 8
  }
});
