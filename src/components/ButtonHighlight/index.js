import React from 'react'
import {Pressable, Animated, InteractionManager} from 'react-native'
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
        }).start(() => {
            opacity.setValue(1)
            if(onPress && typeof onPress === 'function') {
                InteractionManager.runAfterInteractions(() => {
                    onPress()
                })
            }
           
        })
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