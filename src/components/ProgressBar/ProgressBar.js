import * as React from 'react';
import {LogBox, View, StyleSheet, Animated} from 'react-native';

import {colors} from '../../utils/colors';

function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const ProgressBar = (props) => {
  let animation = React.useRef(new Animated.Value(0));
  const [progress, setProgress] = React.useState(50);
  useInterval(() => {
    if (progress < 100 && !props.isStatic) {
      setProgress(progress + 5);
    }
  }, 1000);

  React.useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 100,
    }).start();
  }, [progress]);

  React.useEffect(() => {
    setProgress(props.value);
  }, [props.value]);

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View
          style={
            ([StyleSheet.absoluteFill],
            {backgroundColor: colors.bondi_blue, borderRadius: 5, width})
          }
        />
      </View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.porcelain,
    borderRadius: 5,
  },
  progressBar: {
    flexDirection: 'row',
    height: 8,
    width: '100%',
    backgroundColor: colors.alto,
    borderRadius: 5,
  },
});
