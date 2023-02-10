import * as React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

/**
 *
 * @param {BaseButtonAddPostProps} param0
 * @returns
 */
const BaseButtonAddPost = ({
  onAddPostPressed = () => {},
  children = undefined,
  testID = null,
  containerStyle = {}
}) => {
  const renderChildren = children || (
    <MemoIc_pencil
      width={dimen.normalizeDimen(21)}
      height={dimen.normalizeDimen(21)}
      color={COLORS.white}
      style={{
        alignSelf: 'center'
      }}
    />
  );

  const style = StyleSheet.flatten([styles.container, containerStyle]);

  return (
    <TouchableOpacity testID={testID} style={style} onPress={onAddPostPressed}>
      {renderChildren}
    </TouchableOpacity>
  );
};

export default BaseButtonAddPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#23C5B6',
    width: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    height: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    borderRadius: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    justifyContent: 'center',
    position: 'absolute',
    bottom: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM,
    right: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1
  },
  text: {
    fontFamily: fonts.inter[500],
    color: '#fff',
    fontSize: 12,
    marginLeft: 9.67
  }
});
