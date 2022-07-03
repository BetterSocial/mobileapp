import React from 'react'
import {Pressable, Animated, Text, PressableProps} from 'react-native'
import PropTypes from 'prop-types';

const ButtonHightlight = (props) => {
    const {onPress, style, children} = props
    const opacity = React.useRef(new Animated.Value(100)).current
    const ButtonAnimated = Animated.createAnimatedComponent(Pressable)

    const onPressClick = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start()
       setTimeout(() => {
        Animated.timing(opacity, {
            toValue: 100,
            duration: 100,
            useNativeDriver: true
        }).start(() => {
            if(onPress && typeof onPress === 'function') onPress()
        })
       }, 300)
    }


    return (
        <ButtonAnimated {...props} style={[style, {opacity: opacity}]} onPress={onPressClick}  >
            {children}
        </ButtonAnimated>
    )
}

ButtonHightlight.propTypes = {
   onPress: PropTypes.func,
   children: PropTypes.node

}

ButtonHightlight.defaultProps = {
    styles: []
}

export default ButtonHightlight