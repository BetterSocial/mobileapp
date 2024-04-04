import * as React from 'react';
import NetInfo from '@react-native-community/netinfo';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../utils/theme';

/**
 *
 * @param {NetworkStatusIndicatorProps} param0
 * @returns
 */
const NetworkStatusIndicator = ({hide = false}) => {
  const [isOnline, setIsOnline] = React.useState(true);
  const removeTimeout = React.useRef(null);
  const isHidden = hide || true;

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (isOnline !== state.isConnected) {
        removeTimeout.current = setTimeout(() => {
          setIsOnline(state.isConnected);
        }, 3500);
      }
    });

    return () => {
      unsubscribe();
      if (removeTimeout.current) {
        clearTimeout(removeTimeout.current);
      }
    };
  }, []);

  // eslint-disable-next-line no-constant-condition
  if (isHidden) return <View testID="isHide" />;

  if (!isOnline)
    return (
      <View testID="internet-not-available" style={styles.container}>
        <View style={styles.bottomContainer}>
          <ActivityIndicator color={COLORS.almostBlack} size={14} />
          <Text style={styles.text}>No Internet Connection</Text>
        </View>
      </View>
    );

  return <></>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    zIndex: 100
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 100,
    padding: 4,
    backgroundColor: COLORS.redalert,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  text: {
    color: COLORS.almostBlack,
    alignSelf: 'center',
    marginEnd: 8,
    marginStart: 8
  }
});

export default NetworkStatusIndicator;
