import * as React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

import {COLORS} from '../../utils/theme';

/**
 *
 * @param {NetworkStatusIndicatorProps} param0
 * @returns
 */
const NetworkStatusIndicator = ({hide = false}) => {
  const [isOnline, setIsOnline] = React.useState(true);
  const {isInternetReachable} = useNetInfo();
  const removeTimeout = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (removeTimeout.current) {
        clearTimeout(removeTimeout.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (isInternetReachable) {
      clearTimeout(removeTimeout.current);
      if (!isOnline) {
        setIsOnline(true);
      }
    }

    if (isOnline !== isInternetReachable) {
      removeTimeout.current = setTimeout(() => {
        setIsOnline(false);
      }, 3500);
    }
  }, [isInternetReachable, removeTimeout.current]);

  if (hide) return <View testID="isHide" />;

  if (!isOnline)
    return (
      <View testID="internet-not-available" style={styles.container}>
        <View style={styles.bottomContainer}>
          <ActivityIndicator color={COLORS.white} size={14} />
          <Text style={styles.text}>No Internet Connection</Text>
        </View>
      </View>
    );

  return null;
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
    backgroundColor: COLORS.red,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  text: {
    color: COLORS.white,
    alignSelf: 'center',
    marginEnd: 8,
    marginStart: 8
  }
});

export default NetworkStatusIndicator;
