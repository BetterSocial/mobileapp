import PropTypes from 'prop-types';
import React from 'react';
import {Animated, InteractionManager, Pressable} from 'react-native';

const ButtonHightlight = (props) => {
  const {onPress, style, children, onLongPress} = props;
  const interactionManagerRef = React.useRef(null);
  const [opacity] = React.useState(new Animated.Value(100));
  const ButtonAnimated = Animated.createAnimatedComponent(Pressable);

  React.useEffect(() => {
    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
    };
  }, []);

  const onPressClick = React.useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0.2,
      duration: 100,
      useNativeDriver: true
    }).start(() => {
      opacity.setValue(1);
      if (onPress && typeof onPress === 'function') {
        interactionManagerRef.current = InteractionManager.runAfterInteractions(() => {
          onPress();
        });
      }
    });
  }, [onPress]);

  return (
    <ButtonAnimated
      {...props}
      accessibilityLabel={props.testID}
      testID={props.testID}
      style={[style, {opacity}]}
      onLongPress={onLongPress}
      onPress={onPressClick}>
      {children}
    </ButtonAnimated>
  );
};

ButtonHightlight.propTypes = {
  onPress: PropTypes.func,
  children: PropTypes.node
};

ButtonHightlight.defaultProps = {
  styles: []
};

export default React.memo(ButtonHightlight);
